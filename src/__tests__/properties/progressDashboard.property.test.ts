import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { createElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressDashboard } from '../../components/progress/ProgressDashboard'
import type { UserProgress, QuizSessionResult, PracticeResult } from '../../types'

const arbitraryQuizResult = (): fc.Arbitrary<QuizSessionResult> =>
  fc.integer({ min: 1, max: 20 }).chain((total) =>
    fc.integer({ min: 0, max: total }).map((correct) => ({
      sessionId: `s${Math.random()}`,
      questions: [],
      answers: [],
      correctCount: correct,
      totalCount: total,
      durationMs: 1000,
      completedAt: new Date().toISOString(),
    }))
  )

const arbitraryPracticeResult = (): fc.Arbitrary<PracticeResult> =>
  fc.record({
    gameId: fc.string({ minLength: 1 }),
    rank: fc.integer({ min: 1, max: 4 }),
    finalScore: fc.integer({ min: 0, max: 50000 }),
    yakuEncountered: fc.array(fc.string()),
    completedAt: fc.constant(new Date().toISOString()),
  })

const arbitraryProgress = (): fc.Arbitrary<UserProgress> =>
  fc.record({
    completedLessons: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 10 }),
    learnedYaku: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 10 }),
    quizHistory: fc.array(arbitraryQuizResult(), { maxLength: 5 }),
    practiceHistory: fc.array(arbitraryPracticeResult(), { maxLength: 5 }),
    badges: fc.constant([]),
    lastUpdated: fc.constant(new Date().toISOString()),
  })

// Feature: mahjong-learning-app, Property 15: ダッシュボードが必要情報を含む
describe('Property 15: ダッシュボードが必要情報を含む', () => {
  it('任意のUserProgressで学習済みレッスン数・クイズ正答率・対戦成績を含む', () => {
    fc.assert(
      fc.property(arbitraryProgress(), fc.double({ min: 0, max: 1, noNaN: true }), (progress, rate) => {
        const { container, unmount } = render(
          createElement(
            MemoryRouter,
            null,
            createElement(ProgressDashboard, { progress, completionRate: rate, onReset: () => {} })
          )
        )
        const text = container.textContent ?? ''
        const hasLessonLabel = text.includes('学習済みレッスン数')
        const hasQuizLabel = text.includes('クイズ正答率')
        const hasPracticeLabel = text.includes('対戦成績')
        // 数値の反映も確認
        const hasLessonCount = text.includes(String(progress.completedLessons.length))
        unmount()
        return hasLessonLabel && hasQuizLabel && hasPracticeLabel && hasLessonCount
      }),
      { numRuns: 100 }
    )
  })
})
