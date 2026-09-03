import type { UserProgress, QuizSessionResult, PracticeResult } from '../types'

const STORAGE_KEYS = {
  tiles: 'mahjong_progress_tiles',
  yaku: 'mahjong_progress_yaku',
  quiz: 'mahjong_progress_quiz',
  score: 'mahjong_progress_score',
  practice: 'mahjong_progress_practice',
} as const

// localStorage の総レッスン数・役数（完了率計算用）
const TOTAL_LESSONS = 10
const TOTAL_YAKU = 36

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn(`localStorage への書き込みに失敗しました: ${key}`)
  }
}

export interface ProgressTracker {
  markLessonComplete(lessonId: string): void
  markYakuLearned(yakuId: string): void
  recordQuizResult(sessionId: string, result: QuizSessionResult): void
  recordPracticeResult(result: PracticeResult): void
  getProgress(): UserProgress
  resetProgress(): void
  calculateCompletionRate(): number
}

export function createProgressTracker(): ProgressTracker {
  function markLessonComplete(lessonId: string): void {
    const current = safeGetItem<string[]>(STORAGE_KEYS.tiles, [])
    if (!current.includes(lessonId)) {
      safeSetItem(STORAGE_KEYS.tiles, [...current, lessonId])
    }
  }

  function markYakuLearned(yakuId: string): void {
    const current = safeGetItem<string[]>(STORAGE_KEYS.yaku, [])
    if (!current.includes(yakuId)) {
      safeSetItem(STORAGE_KEYS.yaku, [...current, yakuId])
    }
  }

  function recordQuizResult(sessionId: string, result: QuizSessionResult): void {
    const current = safeGetItem<QuizSessionResult[]>(STORAGE_KEYS.quiz, [])
    // 同じ sessionId は上書き
    const filtered = current.filter((r) => r.sessionId !== sessionId)
    safeSetItem(STORAGE_KEYS.quiz, [...filtered, result])
  }

  function recordPracticeResult(result: PracticeResult): void {
    const current = safeGetItem<PracticeResult[]>(STORAGE_KEYS.practice, [])
    safeSetItem(STORAGE_KEYS.practice, [...current, result])
  }

  function getProgress(): UserProgress {
    const completedLessons = safeGetItem<string[]>(STORAGE_KEYS.tiles, [])
    const learnedYaku = safeGetItem<string[]>(STORAGE_KEYS.yaku, [])
    const quizHistory = safeGetItem<QuizSessionResult[]>(STORAGE_KEYS.quiz, [])
    const practiceHistory = safeGetItem<PracticeResult[]>(STORAGE_KEYS.practice, [])

    return {
      completedLessons,
      learnedYaku,
      quizHistory,
      practiceHistory,
      badges: completedLessons.length >= TOTAL_LESSONS ? ['all_lessons_complete'] : [],
      lastUpdated: new Date().toISOString(),
    }
  }

  function resetProgress(): void {
    safeSetItem(STORAGE_KEYS.tiles, [])
    safeSetItem(STORAGE_KEYS.yaku, [])
    safeSetItem(STORAGE_KEYS.quiz, [])
    safeSetItem(STORAGE_KEYS.score, [])
    safeSetItem(STORAGE_KEYS.practice, [])
  }

  function calculateCompletionRate(): number {
    const progress = getProgress()
    const lessonRate = Math.min(progress.completedLessons.length / TOTAL_LESSONS, 1)
    const yakuRate = Math.min(progress.learnedYaku.length / TOTAL_YAKU, 1)
    const rate = (lessonRate + yakuRate) / 2
    return Math.max(0, Math.min(1, rate))
  }

  return {
    markLessonComplete,
    markYakuLearned,
    recordQuizResult,
    recordPracticeResult,
    getProgress,
    resetProgress,
    calculateCompletionRate,
  }
}

// デフォルトシングルトンインスタンス
export const progressTracker = createProgressTracker()
