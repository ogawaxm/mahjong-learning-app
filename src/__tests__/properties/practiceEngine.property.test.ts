import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { createPracticeEngine } from '../../modules/practiceEngine'
import type { Difficulty, GameState } from '../../types'

const store: Record<string, string> = {}
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => Object.keys(store).forEach((k) => delete store[k]),
  },
  writable: true,
})

const engine = createPracticeEngine()
const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced']

beforeEach(() => localStorage.clear())

// Feature: mahjong-learning-app, Property 11: CPUターンが1秒以内に完了する
describe('Property 11: CPUターンが1秒以内に完了する', () => {
  it('任意の難易度でprocessCPUTurnは1000ms以内に解決する', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constantFrom(...difficulties), async (difficulty) => {
        const state = engine.startGame(difficulty)
        const start = Date.now()
        await engine.processCPUTurn(state)
        const elapsed = Date.now() - start
        return elapsed <= 1000
      }),
      { numRuns: 30 }
    )
  })
})

// Feature: mahjong-learning-app, Property 13: GameState save/load ラウンドトリップ
describe('Property 13: GameState save/load ラウンドトリップ', () => {
  it('saveGameState後にloadGameStateで等価なオブジェクトが返る', () => {
    fc.assert(
      fc.property(fc.constantFrom(...difficulties), (difficulty) => {
        localStorage.clear()
        const state = engine.startGame(difficulty)
        engine.saveGameState(state)
        const loaded = engine.loadGameState()
        return JSON.stringify(loaded) === JSON.stringify(state)
      }),
      { numRuns: 50 }
    )
  })
})

// Feature: mahjong-learning-app, Property 12: ゲーム結果に順位・点数・役が含まれる
describe('Property 12: ゲーム結果に順位・点数・役が含まれる', () => {
  it('任意の対局終了状態でPracticeResultはrank・finalScore・yakuEncounteredを含む', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...difficulties),
        fc.array(fc.integer({ min: 0, max: 50000 }), { minLength: 4, maxLength: 4 }),
        (difficulty, scores) => {
          const state: GameState = engine.startGame(difficulty)
          // スコアを設定
          state.players.forEach((p, i) => { p.score = scores[i] })
          state.phase = 'end'
          const result = engine.buildResult(state)
          return (
            typeof result.rank === 'number' &&
            result.rank >= 1 &&
            result.rank <= 4 &&
            typeof result.finalScore === 'number' &&
            Array.isArray(result.yakuEncountered)
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  it('スコア最上位のプレイヤーが1位になる', () => {
    const state = engine.startGame('beginner')
    state.players[0].score = 99999 // 人間を最高得点に
    state.players[1].score = 100
    state.players[2].score = 200
    state.players[3].score = 300
    const result = engine.buildResult(state)
    expect(result.rank).toBe(1)
  })
})
