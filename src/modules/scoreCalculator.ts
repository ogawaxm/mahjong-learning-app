import type { Hand, WinCondition, GameContext, ScoreResult, ScoreBreakdownStep } from '../types'
import { createYakuEngine } from './yakuEngine'

export class ScoreCalculationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ScoreCalculationError'
  }
}

const engine = createYakuEngine()

// 符を10単位に切り上げ
function ceilFu(fu: number): number {
  return Math.ceil(fu / 10) * 10
}

// 基本点から各支払いを計算（簡易版）
function calcTotalPoints(basePoints: number, isTsumo: boolean, isDealer: boolean): number {
  if (isDealer) {
    // 親
    if (isTsumo) return Math.ceil((basePoints * 2) / 100) * 100 * 3
    return Math.ceil((basePoints * 6) / 100) * 100
  }
  // 子
  if (isTsumo) {
    const fromDealer = Math.ceil((basePoints * 2) / 100) * 100
    const fromNonDealer = Math.ceil((basePoints * 1) / 100) * 100
    return fromDealer + fromNonDealer * 2
  }
  return Math.ceil((basePoints * 4) / 100) * 100
}

export interface ScoreCalculator {
  calculate(hand: Hand, winCondition: WinCondition, gameContext: GameContext): ScoreResult
}

export function createScoreCalculator(): ScoreCalculator {
  function calculate(hand: Hand, winCondition: WinCondition, gameContext: GameContext): ScoreResult {
    // あがりが成立しない手牌はエラー
    if (!engine.isWinningHand(hand)) {
      throw new ScoreCalculationError('あがりが成立しません')
    }

    const detectedYaku = engine.detectYaku(hand, gameContext)
    // 役なしはあがれない（形式テンパイ扱いはここでは除外）
    if (detectedYaku.length === 0) {
      throw new ScoreCalculationError('あがりが成立しません')
    }

    const breakdown: ScoreBreakdownStep[] = []

    // 飜数集計
    let han = 0
    const isMenzen = !hand.calledMelds || hand.calledMelds.length === 0
    for (const y of detectedYaku) {
      const hanValue = isMenzen ? y.han : (y.hanOpen ?? 0)
      han += hanValue
      breakdown.push({ label: `${y.name}`, value: hanValue })
    }

    // 符計算（簡易版）
    let fu = 20 // 基本符
    breakdown.push({ label: '基本符', value: 20 })

    if (winCondition.type === 'tsumo') {
      fu += 2
      breakdown.push({ label: 'ツモ符', value: 2 })
    } else if (isMenzen) {
      fu += 10
      breakdown.push({ label: '門前ロン符', value: 10 })
    }

    const finalFu = ceilFu(fu)
    breakdown.push({ label: '符合計(切り上げ)', value: finalFu })

    // 基本点 = fu * 2^(2+han)
    const basePoints = finalFu * Math.pow(2, 2 + han)
    const isDealer = gameContext.seatWind === 'east'
    const totalPoints = calcTotalPoints(basePoints, winCondition.type === 'tsumo', isDealer)

    breakdown.push({ label: '合計点数', value: totalPoints })

    return {
      yaku: detectedYaku,
      han,
      fu: finalFu,
      basePoints,
      totalPoints,
      breakdown,
    }
  }

  return { calculate }
}

export const scoreCalculator = createScoreCalculator()
