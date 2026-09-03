import { describe, it, expect } from 'vitest'
import { createYakuEngine } from '../../modules/yakuEngine'
import { getYakuById } from '../../data/yaku'
import type { GameContext } from '../../types'

const engine = createYakuEngine()

const defaultContext: GameContext = {
  roundWind: 'east',
  seatWind: 'east',
  isRiichi: false,
  isTsumo: false,
  doraIndicators: [],
}

describe('YakuEngine.isWinningHand', () => {
  it('タンヤオの成立例はあがり形と判定される', () => {
    const yaku = getYakuById('tanyao')!
    for (const h of yaku.examplesValid) {
      expect(engine.isWinningHand(h)).toBe(true)
    }
  })

  it('七対子の成立例はあがり形と判定される', () => {
    const yaku = getYakuById('chiitoitsu')!
    for (const h of yaku.examplesValid) {
      expect(engine.isWinningHand(h)).toBe(true)
    }
  })
})

describe('YakuEngine.detectYaku', () => {
  it('タンヤオの成立例でタンヤオを検出する', () => {
    const yaku = getYakuById('tanyao')!
    const detected = engine.detectYaku(yaku.examplesValid[0], defaultContext)
    expect(detected.some((y) => y.id === 'tanyao')).toBe(true)
  })

  it('七対子の成立例で七対子を検出する', () => {
    const yaku = getYakuById('chiitoitsu')!
    const detected = engine.detectYaku(yaku.examplesValid[0], defaultContext)
    expect(detected.some((y) => y.id === 'chiitoitsu')).toBe(true)
  })

  it('大三元の成立例で大三元を検出する', () => {
    const yaku = getYakuById('daisangen')!
    const detected = engine.detectYaku(yaku.examplesValid[0], defaultContext)
    expect(detected.some((y) => y.id === 'daisangen')).toBe(true)
  })
})
