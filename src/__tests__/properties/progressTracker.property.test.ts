import { describe, it, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { createProgressTracker } from '../../modules/progressTracker'
import type { QuizSessionResult, PracticeResult } from '../../types'

// localStorage のモック
const store: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
}
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })

beforeEach(() => {
  localStorageMock.clear()
})

// arbitrary: QuizSessionResult
const arbitraryQuizResult = (): fc.Arbitrary<QuizSessionResult> =>
  fc.record({
    sessionId: fc.uuid(),
    questions: fc.constant([]),
    answers: fc.constant([]),
    correctCount: fc.nat(10),
    totalCount: fc.integer({ min: 1, max: 10 }),
    durationMs: fc.nat(60000),
    completedAt: fc.constant(new Date().toISOString()),
  })

// arbitrary: PracticeResult
const arbitraryPracticeResult = (): fc.Arbitrary<PracticeResult> =>
  fc.record({
    gameId: fc.uuid(),
    rank: fc.integer({ min: 1, max: 4 }),
    finalScore: fc.integer({ min: 0, max: 100000 }),
    yakuEncountered: fc.array(fc.string({ minLength: 1, maxLength: 20 })),
    completedAt: fc.constant(new Date().toISOString()),
  })

// Feature: mahjong-learning-app, Property 2: 進捗記録ラウンドトリップ
describe('Property 2: 進捗記録ラウンドトリップ', () => {
  it('markLessonComplete後にgetProgressでそのlessonIdが含まれる', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 50 }), (lessonId) => {
        localStorageMock.clear()
        const tracker = createProgressTracker()
        tracker.markLessonComplete(lessonId)
        const progress = tracker.getProgress()
        return progress.completedLessons.includes(lessonId)
      }),
      { numRuns: 100 }
    )
  })

  it('markYakuLearned後にgetProgressでそのyakuIdが含まれる', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 50 }), (yakuId) => {
        localStorageMock.clear()
        const tracker = createProgressTracker()
        tracker.markYakuLearned(yakuId)
        const progress = tracker.getProgress()
        return progress.learnedYaku.includes(yakuId)
      }),
      { numRuns: 100 }
    )
  })

  it('recordQuizResult後にgetProgressでそのセッションが含まれる', () => {
    fc.assert(
      fc.property(arbitraryQuizResult(), (result) => {
        localStorageMock.clear()
        const tracker = createProgressTracker()
        tracker.recordQuizResult(result.sessionId, result)
        const progress = tracker.getProgress()
        return progress.quizHistory.some((r) => r.sessionId === result.sessionId)
      }),
      { numRuns: 100 }
    )
  })
})

// Feature: mahjong-learning-app, Property 14: 進捗データ localStorage 永続化ラウンドトリップ
describe('Property 14: localStorage 永続化ラウンドトリップ', () => {
  it('保存して別インスタンスで読み込んでも同じデータが返る', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 5 }),
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 5 }),
        (lessonIds, yakuIds) => {
          localStorageMock.clear()
          const tracker1 = createProgressTracker()
          for (const id of lessonIds) tracker1.markLessonComplete(id)
          for (const id of yakuIds) tracker1.markYakuLearned(id)

          // 別インスタンスで読み込み
          const tracker2 = createProgressTracker()
          const progress = tracker2.getProgress()

          const uniqueLessons = [...new Set(lessonIds)]
          const uniqueYaku = [...new Set(yakuIds)]
          return (
            uniqueLessons.every((id) => progress.completedLessons.includes(id)) &&
            uniqueYaku.every((id) => progress.learnedYaku.includes(id))
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: mahjong-learning-app, Property 16: 完了率が 0〜100% の範囲に収まる
describe('Property 16: 完了率の範囲', () => {
  it('calculateCompletionRateは常に0.0〜1.0の範囲に収まる', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 20 }),
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 40 }),
        (lessonIds, yakuIds) => {
          localStorageMock.clear()
          const tracker = createProgressTracker()
          for (const id of lessonIds) tracker.markLessonComplete(id)
          for (const id of yakuIds) tracker.markYakuLearned(id)
          const rate = tracker.calculateCompletionRate()
          return rate >= 0.0 && rate <= 1.0
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: mahjong-learning-app, Property 17: リセット後に進捗が空になる
describe('Property 17: リセット後に進捗が空になる', () => {
  it('resetProgress後にgetProgressはすべての配列が空になる', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 5 }),
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 5 }),
        arbitraryPracticeResult(),
        (lessonIds, yakuIds, practiceResult) => {
          localStorageMock.clear()
          const tracker = createProgressTracker()
          for (const id of lessonIds) tracker.markLessonComplete(id)
          for (const id of yakuIds) tracker.markYakuLearned(id)
          tracker.recordPracticeResult(practiceResult)

          tracker.resetProgress()
          const progress = tracker.getProgress()

          return (
            progress.completedLessons.length === 0 &&
            progress.learnedYaku.length === 0 &&
            progress.quizHistory.length === 0 &&
            progress.practiceHistory.length === 0
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})
