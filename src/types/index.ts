// 牌スート
export type TileSuit = 'man' | 'pin' | 'sou' | 'wind' | 'dragon'

// 牌
export interface Tile {
  id: string
  suit: TileSuit
  value: number | null
  name: string
  reading: string
  altText: string
}

// 鳴き面子
export interface Meld {
  type: 'pon' | 'chi' | 'kan'
  tiles: Tile[]
}

// 手牌
export interface Hand {
  tiles: Tile[]
  drawnTile?: Tile
  calledMelds?: Meld[]
}

// 役
export interface Yaku {
  id: string
  name: string
  han: number
  hanOpen: number | null
  description: string
  conditions: string[]
  examplesValid: Hand[]
  examplesInvalid: Hand[]
}

// ゲームコンテキスト
export interface GameContext {
  roundWind: 'east' | 'south' | 'west' | 'north'
  seatWind: 'east' | 'south' | 'west' | 'north'
  isRiichi: boolean
  isTsumo: boolean
  doraIndicators: Tile[]
}

// あがり条件
export interface WinCondition {
  type: 'tsumo' | 'ron'
  winningTile: Tile
}

// 点数計算内訳ステップ
export interface ScoreBreakdownStep {
  label: string
  value: number
}

// 点数計算結果
export interface ScoreResult {
  yaku: Yaku[]
  han: number
  fu: number
  basePoints: number
  totalPoints: number
  breakdown: ScoreBreakdownStep[]
}

// クイズ問題
export interface QuizQuestion {
  id: string
  hand: Hand
  correctYaku: Yaku[]
}

// クイズ回答
export interface QuizAnswer {
  questionId: string
  selectedYaku: Yaku[]
  isCorrect: boolean
}

// クイズセッション結果
export interface QuizSessionResult {
  sessionId: string
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  correctCount: number
  totalCount: number
  durationMs: number
  completedAt: string
}

// 難易度
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

// プレイヤー
export interface Player {
  id: string
  isHuman: boolean
  hand: Hand
  score: number
}

// ゲーム状態
export interface GameState {
  players: Player[]
  currentTurn: number
  wall: Tile[]
  discardPiles: Tile[][]
  roundWind: string
  turnNumber: number
  phase: 'draw' | 'discard' | 'call' | 'end'
  difficulty: Difficulty
}

// 対局結果
export interface PracticeResult {
  gameId: string
  rank: number
  finalScore: number
  yakuEncountered: string[]
  completedAt: string
}

// 学習進捗
export interface UserProgress {
  completedLessons: string[]
  learnedYaku: string[]
  quizHistory: QuizSessionResult[]
  practiceHistory: PracticeResult[]
  badges: string[]
  lastUpdated: string
}

// セッション状態
export interface SessionState {
  mode: 'tiles' | 'yaku' | 'quiz' | 'score' | 'practice'
  lastVisitedAt: string
  resumeData: unknown
}

// ヒント結果
export interface HintResult {
  usefulTiles: Tile[]
  shanten: number
  message: string
}
