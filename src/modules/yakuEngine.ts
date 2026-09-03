import type { Hand, Tile, GameContext, Yaku } from '../types'
import { YAKU_LIST } from '../data/yaku'

// ---- 牌ユーティリティ ----

function isHonor(tile: Tile): boolean {
  return tile.suit === 'wind' || tile.suit === 'dragon'
}

function isTerminalOrHonor(tile: Tile): boolean {
  return isHonor(tile) || tile.value === 1 || tile.value === 9
}

// 手牌を suit ごとにグループ化して数値の出現数を数える
function countMap(tiles: Tile[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const t of tiles) {
    m.set(t.id, (m.get(t.id) ?? 0) + 1)
  }
  return m
}

// 全14枚を取得（ツモ牌含む）
function allTiles(hand: Hand): Tile[] {
  const tiles = [...hand.tiles]
  if (hand.drawnTile) tiles.push(hand.drawnTile)
  for (const meld of hand.calledMelds ?? []) tiles.push(...meld.tiles)
  return tiles
}

// 数牌の suit+value を数値キーに（順子判定用）
type SuitCounts = Record<string, number[]> // suit -> [1..9]の出現数（index 1-9使用）

function buildSuitCounts(tiles: Tile[]): { suits: SuitCounts; honors: Map<string, number> } {
  const suits: SuitCounts = { man: new Array(10).fill(0), pin: new Array(10).fill(0), sou: new Array(10).fill(0) }
  const honors = new Map<string, number>()
  for (const t of tiles) {
    if (t.suit === 'man' || t.suit === 'pin' || t.suit === 'sou') {
      if (t.value != null) suits[t.suit][t.value]++
    } else {
      honors.set(t.id, (honors.get(t.id) ?? 0) + 1)
    }
  }
  return { suits, honors }
}

// 数牌スートが面子（順子・刻子）のみで分解できるか（雀頭は別で処理）
function canFormMelds(counts: number[]): boolean {
  const c = [...counts]
  for (let i = 1; i <= 9; i++) {
    if (c[i] < 0) return false
    if (c[i] === 0) continue
    // 刻子として消費を試す
    if (c[i] >= 3) {
      const t = [...c]
      t[i] -= 3
      if (canFormMelds(t)) return true
    }
    // 順子として消費を試す
    if (i <= 7 && c[i] > 0 && c[i + 1] > 0 && c[i + 2] > 0) {
      const t = [...c]
      t[i]--; t[i + 1]--; t[i + 2]--
      if (canFormMelds(t)) return true
    }
    return false
  }
  return true
}

// 字牌が面子（刻子）のみで分解できるか
function honorsAllTriplets(honors: Map<string, number>): boolean {
  for (const v of honors.values()) {
    if (v % 3 !== 0) return false
  }
  return true
}

// 標準形（4面子1雀頭）判定
function isStandardWin(tiles: Tile[]): boolean {
  if (tiles.length !== 14) return false
  const map = countMap(tiles)
  // 各牌を雀頭候補として試す
  for (const [id, cnt] of map) {
    if (cnt < 2) continue
    const rest = tiles.filter((t) => t.id !== id).concat(
      // 雀頭2枚を除いた残りを再構築
      []
    )
    // 雀頭2枚を除く
    const remaining: Tile[] = []
    let removed = 0
    for (const t of tiles) {
      if (t.id === id && removed < 2) {
        removed++
        continue
      }
      remaining.push(t)
    }
    void rest
    const { suits, honors } = buildSuitCounts(remaining)
    if (
      canFormMelds(suits.man) &&
      canFormMelds(suits.pin) &&
      canFormMelds(suits.sou) &&
      honorsAllTriplets(honors)
    ) {
      return true
    }
  }
  return false
}

// 七対子判定
function isSevenPairs(tiles: Tile[]): boolean {
  if (tiles.length !== 14) return false
  const map = countMap(tiles)
  if (map.size !== 7) return false
  for (const v of map.values()) {
    if (v !== 2) return false
  }
  return true
}

export interface YakuEngine {
  detectYaku(hand: Hand, context: GameContext): Yaku[]
  isWinningHand(hand: Hand): boolean
}

export function createYakuEngine(): YakuEngine {
  function isWinningHand(hand: Hand): boolean {
    const tiles = allTiles(hand)
    return isStandardWin(tiles) || isSevenPairs(tiles)
  }

  function detectYaku(hand: Hand, context: GameContext): Yaku[] {
    const tiles = allTiles(hand)
    if (!isWinningHand(hand)) return []

    const detected: Yaku[] = []
    const yakuById = (id: string) => YAKU_LIST.find((y) => y.id === id)!

    const isMenzen = !hand.calledMelds || hand.calledMelds.length === 0

    // タンヤオ
    if (tiles.every((t) => !isTerminalOrHonor(t))) {
      detected.push(yakuById('tanyao'))
    }

    // 七対子
    if (isSevenPairs(tiles) && isMenzen) {
      detected.push(yakuById('chiitoitsu'))
    }

    // 役牌 白
    const hakuCount = tiles.filter((t) => t.id === 'dragon_haku').length
    if (hakuCount >= 3) {
      detected.push(yakuById('yakuhai_haku'))
    }

    // 字一色
    if (tiles.every((t) => isHonor(t))) {
      detected.push(yakuById('tsuuiisou'))
    }

    // 大三元
    const haku = tiles.filter((t) => t.id === 'dragon_haku').length >= 3
    const hatsu = tiles.filter((t) => t.id === 'dragon_hatsu').length >= 3
    const chun = tiles.filter((t) => t.id === 'dragon_chun').length >= 3
    if (haku && hatsu && chun) {
      detected.push(yakuById('daisangen'))
    }

    // リーチ（コンテキスト依存）
    if (context.isRiichi && isMenzen && isStandardWin(tiles)) {
      detected.push(yakuById('riichi'))
    }

    // 一気通貫（同一スートで1-9すべて存在）
    for (const suit of ['man', 'pin', 'sou'] as const) {
      const vals = new Set(tiles.filter((t) => t.suit === suit).map((t) => t.value))
      if ([1, 2, 3, 4, 5, 6, 7, 8, 9].every((v) => vals.has(v))) {
        detected.push(yakuById('ittsuu'))
        break
      }
    }

    // 重複除去
    const unique = new Map<string, Yaku>()
    for (const y of detected) unique.set(y.id, y)
    return [...unique.values()]
  }

  return { detectYaku, isWinningHand }
}

export const yakuEngine = createYakuEngine()
