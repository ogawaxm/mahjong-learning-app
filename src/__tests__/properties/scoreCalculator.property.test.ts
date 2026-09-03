import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { createScoreCalculator, ScoreCalculationError } from '../../modules/scoreCalculator'
import { YAKU_LIST } from '../../data/yaku'
import { ALL_TILES } from '../../constants/tiles'
import { createYakuEngine } from '../../modules/yakuEngine'
import type { GameContext, WinCondition, Hand } from '../../types'

const calc = createScoreCalculator()
const engine = createYakuEngine()

const context: GameContext = {
  roundWind: 'east',
  seatWind: 'south',
  isRiichi: false,
  isTsumo: false,
  doraIndicators: [],
}

// 役ありのあがり手牌（examplesValid をプール）
const validWinningHands: Hand[] = YAKU_LIST.flatMap((y) => y.examplesValid).filter((h) =>
  engine.isWinningHand(h)
)

const winCondition: WinCondition = {
  type: 'ron',
  winningTile: ALL_TILES[0],
}

// Feature: mahjong-learning-app, Property 9: ScoreCalculator が計算結果と内訳を返す
describe('Property 9: ScoreCalculator が計算結果と内訳を返す', () => {
  it('あがり手牌に対してhan・fu・totalPoints・非空breakdownを返す', () => {
    fc.assert(
      fc.property(fc.constantFrom(...validWinningHands), (hand) => {
        // 役が検出される手牌のみ対象
        const yaku = engine.detectYaku(hand, context)
        fc.pre(yaku.length > 0)
        const result = calc.calculate(hand, winCondition, context)
        return (
          typeof result.han === 'number' &&
          result.han > 0 &&
          typeof result.fu === 'number' &&
          result.fu > 0 &&
          typeof result.totalPoints === 'number' &&
          result.totalPoints > 0 &&
          Array.isArray(result.breakdown) &&
          result.breakdown.length > 0
        )
      }),
      { numRuns: 100 }
    )
  })
})

// Feature: mahjong-learning-app, Property 10: 不正手牌でエラーが返る
describe('Property 10: 不正手牌でエラーが返る', () => {
  it('あがりが成立しない牌の組み合わせでエラーを返す', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: ALL_TILES.length - 1 }), { minLength: 14, maxLength: 14 }),
        (indices) => {
          const tiles = indices.map((i) => ALL_TILES[i])
          const hand: Hand = { tiles }
          // あがり形でない手牌のみを対象にする
          fc.pre(!engine.isWinningHand(hand))
          try {
            calc.calculate(hand, winCondition, context)
            return false // エラーが投げられなければ失敗
          } catch (e) {
            return e instanceof ScoreCalculationError
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('明らかな不正手牌で「あがりが成立しません」エラー', () => {
    const hand: Hand = { tiles: ALL_TILES.slice(0, 14) }
    expect(() => calc.calculate(hand, winCondition, context)).toThrow(ScoreCalculationError)
  })
})
