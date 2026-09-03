import type { GameState, Difficulty, Tile, Hand, HintResult, Player, PracticeResult } from '../types'
import { ALL_TILES } from '../constants/tiles'

const STORAGE_KEY = 'mahjong_progress_practice'

// 4コピーの山牌を生成してシャッフル
function buildWall(): Tile[] {
  const wall: Tile[] = []
  for (const tile of ALL_TILES) {
    for (let i = 0; i < 4; i++) wall.push(tile)
  }
  // Fisher-Yates
  for (let i = wall.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[wall[i], wall[j]] = [wall[j], wall[i]]
  }
  return wall
}

function drawTiles(wall: Tile[], n: number): { drawn: Tile[]; rest: Tile[] } {
  return { drawn: wall.slice(0, n), rest: wall.slice(n) }
}

// 牌の不要度スコア（大きいほど不要）：字牌・端牌を不要とみなす簡易ヒューリスティック
function uselessScore(tile: Tile, hand: Tile[]): number {
  const sameCount = hand.filter((t) => t.id === tile.id).length
  let score = 0
  if (tile.suit === 'wind' || tile.suit === 'dragon') score += 3
  if (tile.value === 1 || tile.value === 9) score += 1
  // 同じ牌が複数あれば残したいので不要度を下げる
  score -= sameCount
  return score
}

// シャンテン数の簡易近似（対子・面子候補数から算出、厳密ではない）
function approximateShanten(tiles: Tile[]): number {
  const counts = new Map<string, number>()
  for (const t of tiles) counts.set(t.id, (counts.get(t.id) ?? 0) + 1)
  let pairs = 0
  let triplets = 0
  for (const c of counts.values()) {
    if (c >= 3) triplets++
    else if (c === 2) pairs++
  }
  // 4面子1雀頭を目標にした粗いシャンテン近似
  return Math.max(0, 8 - triplets * 2 - pairs)
}

export interface PracticeEngine {
  startGame(difficulty: Difficulty): GameState
  processPlayerDiscard(state: GameState, tile: Tile): GameState
  processCPUTurn(state: GameState): Promise<GameState>
  getHint(hand: Hand): HintResult
  saveGameState(state: GameState): void
  loadGameState(): GameState | null
  buildResult(state: GameState): PracticeResult
}

export function createPracticeEngine(): PracticeEngine {
  function startGame(difficulty: Difficulty): GameState {
    let wall = buildWall()
    const players: Player[] = []
    for (let i = 0; i < 4; i++) {
      const { drawn, rest } = drawTiles(wall, 13)
      wall = rest
      players.push({
        id: `player_${i}`,
        isHuman: i === 0,
        hand: { tiles: drawn },
        score: 25000,
      })
    }
    return {
      players,
      currentTurn: 0,
      wall,
      discardPiles: [[], [], [], []],
      roundWind: 'east',
      turnNumber: 1,
      phase: 'discard',
      difficulty,
    }
  }

  function processPlayerDiscard(state: GameState, tile: Tile): GameState {
    const players = state.players.map((p) => ({ ...p, hand: { ...p.hand, tiles: [...p.hand.tiles] } }))
    const human = players[0]
    const idx = human.hand.tiles.findIndex((t) => t.id === tile.id)
    if (idx === -1) return state
    human.hand.tiles.splice(idx, 1)

    const discardPiles = state.discardPiles.map((p, i) => (i === 0 ? [...p, tile] : [...p]))

    return {
      ...state,
      players,
      discardPiles,
      currentTurn: 1,
      phase: 'discard',
    }
  }

  // CPU の打牌選択（難易度別ヒューリスティック）
  function chooseDiscard(hand: Tile[], difficulty: Difficulty): Tile {
    if (hand.length === 0) throw new Error('手牌が空です')
    if (difficulty === 'beginner') {
      // ランダム
      return hand[Math.floor(Math.random() * hand.length)]
    }
    if (difficulty === 'intermediate') {
      // 不要牌優先
      return [...hand].sort((a, b) => uselessScore(b, hand) - uselessScore(a, hand))[0]
    }
    // advanced: 各牌を捨てた後のシャンテンが最小になる牌を選ぶ
    let best = hand[0]
    let bestShanten = Infinity
    for (const candidate of hand) {
      const rest = [...hand]
      const idx = rest.findIndex((t) => t.id === candidate.id)
      rest.splice(idx, 1)
      const s = approximateShanten(rest)
      if (s < bestShanten) {
        bestShanten = s
        best = candidate
      }
    }
    return best
  }

  async function processCPUTurn(state: GameState): Promise<GameState> {
    // 各CPU（インデックス1〜3）が順に1枚ツモって1枚打牌する
    let current: GameState = {
      ...state,
      players: state.players.map((p) => ({ ...p, hand: { ...p.hand, tiles: [...p.hand.tiles] } })),
      wall: [...state.wall],
      discardPiles: state.discardPiles.map((p) => [...p]),
    }

    for (let i = 1; i <= 3; i++) {
      const player = current.players[i]
      // ツモ
      if (current.wall.length > 0) {
        const drawn = current.wall.shift()!
        player.hand.tiles.push(drawn)
      }
      // 打牌
      const discard = chooseDiscard(player.hand.tiles, current.difficulty)
      const idx = player.hand.tiles.findIndex((t) => t.id === discard.id)
      player.hand.tiles.splice(idx, 1)
      current.discardPiles[i].push(discard)
    }

    current.currentTurn = 0
    current.turnNumber = state.turnNumber + 1
    // 山が尽きたら終了
    if (current.wall.length < 4) {
      current.phase = 'end'
    }
    return current
  }

  function getHint(hand: Hand): HintResult {
    const tiles = hand.tiles
    const shanten = approximateShanten(tiles)
    // 有効牌の簡易抽出：同種で対子・刻子を作りやすい牌
    const counts = new Map<string, Tile>()
    for (const t of tiles) counts.set(t.id, t)
    const usefulTiles = [...counts.values()].slice(0, 3)
    return {
      usefulTiles,
      shanten,
      message: `あがりまで約${shanten}手です。`,
    }
  }

  function saveGameState(state: GameState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      console.warn('ゲーム状態の保存に失敗しました')
    }
  }

  function loadGameState(): GameState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as GameState) : null
    } catch {
      return null
    }
  }

  function buildResult(state: GameState): PracticeResult {
    // スコア順に順位を決定
    const sorted = [...state.players].sort((a, b) => b.score - a.score)
    const humanRank = sorted.findIndex((p) => p.isHuman) + 1
    const human = state.players.find((p) => p.isHuman)!
    return {
      gameId: `game_${Date.now()}`,
      rank: humanRank,
      finalScore: human.score,
      yakuEncountered: [],
      completedAt: new Date().toISOString(),
    }
  }

  return {
    startGame,
    processPlayerDiscard,
    processCPUTurn,
    getHint,
    saveGameState,
    loadGameState,
    buildResult,
  }
}

export const practiceEngine = createPracticeEngine()
