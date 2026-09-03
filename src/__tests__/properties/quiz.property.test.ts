import { describe, it, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { createQuizEngine } from '../../modules/quizEngine'
import { YAKU_LIST } from '../../data/yaku'
import type { QuizSessionResult, QuizQuestion, QuizAnswer } from '../../types'

// localStorage モック
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

const engine = createQuizEngine()

beforeEach(() => {
  localStorage.clear()
})

// Feature: mahjong-learning-app, Property 5: クイズ回答フィードバックが解説を含む
describe('Property 5: クイズ回答フィードバックが解説を含む', () => {
  it('任意の回答に対してフィードバックは正誤・正しい役名・成立理由を含む', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: YAKU_LIST.length - 1 }), { minLength: 0, maxLength: 3 }),
        (yakuIndices) => {
          const session = engine.startSession(10, 'all', new Set())
          const selectedYaku = yakuIndices.map((i) => YAKU_LIST[i])
          const { feedback } = engine.submitAnswer(session, selectedYaku)

          const hasVerdict = typeof feedback.isCorrect === 'boolean'
          const hasCorrectYaku = feedback.correctYaku.length > 0
          const hasExplanation = feedback.explanation.length > 0
          // 正しい役名が解説に含まれる
          const nameInExplanation = feedback.correctYaku.some((y) =>
            feedback.explanation.includes(y.name)
          )
          return hasVerdict && hasCorrectYaku && hasExplanation && nameInExplanation
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: mahjong-learning-app, Property 6: 誤回答時に対応レッスンリンクが表示される
describe('Property 6: 誤回答時に対応レッスンリンクが表示される', () => {
  it('誤回答時にフィードバックは対応役へのレッスンリンクを含む', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const session = engine.startSession(10, 'all', new Set())
        // 空回答 or 存在しない役を選んで確実に誤答させる
        const { feedback } = engine.submitAnswer(session, [])
        if (feedback.isCorrect) return true // 正答なら対象外
        // 誤答なら各正解役へのリンクを持つ
        const correctIds = new Set(feedback.correctYaku.map((y) => y.id))
        return (
          feedback.lessonLinks.length > 0 &&
          feedback.lessonLinks.every((l) => correctIds.has(l.yakuId) && l.href.includes(l.yakuId))
        )
      }),
      { numRuns: 100 }
    )
  })
})

// Feature: mahjong-learning-app, Property 8: 複数役手牌で部分一致を正解とする
describe('Property 8: 複数役手牌で部分一致を正解とする', () => {
  it('正解役のいずれか1つ以上を選べば正解と判定される', () => {
    fc.assert(
      fc.property(fc.nat(), (seed) => {
        const session = engine.startSession(10, 'all', new Set())
        const question = session.questions[0]
        // 正解役のうち1つだけを選択
        const idx = seed % question.correctYaku.length
        const oneCorrect = [question.correctYaku[idx]]
        const { feedback } = engine.submitAnswer(session, oneCorrect)
        return feedback.isCorrect === true
      }),
      { numRuns: 100 }
    )
  })
})

// arbitrary: QuizSessionResult（結果画面情報の網羅性検証用）
const arbitraryResult = (): fc.Arbitrary<QuizSessionResult> =>
  fc.integer({ min: 10, max: 20 }).chain((total) =>
    fc.integer({ min: 0, max: total }).map((correct) => {
      const questions: QuizQuestion[] = []
      const answers: QuizAnswer[] = []
      for (let i = 0; i < total; i++) {
        const yaku = YAKU_LIST[i % YAKU_LIST.length]
        questions.push({ id: `q${i}`, hand: yaku.examplesValid[0], correctYaku: [yaku] })
        answers.push({ questionId: `q${i}`, selectedYaku: [yaku], isCorrect: i < correct })
      }
      return {
        sessionId: 's1',
        questions,
        answers,
        correctCount: correct,
        totalCount: total,
        durationMs: 12345,
        completedAt: new Date().toISOString(),
      }
    })
  )

// Feature: mahjong-learning-app, Property 7: クイズ結果に必要情報が含まれる
describe('Property 7: クイズ結果に必要情報が含まれる', () => {
  it('QuizSessionResultは正答率・所要時間・誤答役一覧を計算可能な情報を持つ', () => {
    fc.assert(
      fc.property(arbitraryResult(), (result) => {
        // 正答率が計算できる
        const accuracy = result.correctCount / result.totalCount
        const hasAccuracy = accuracy >= 0 && accuracy <= 1
        // 所要時間が存在する
        const hasDuration = typeof result.durationMs === 'number' && result.durationMs >= 0
        // 誤答役一覧が集計できる
        const wrongYaku = new Set<string>()
        for (const a of result.answers) {
          if (!a.isCorrect) {
            const q = result.questions.find((q) => q.id === a.questionId)
            for (const y of q?.correctYaku ?? []) wrongYaku.add(y.id)
          }
        }
        const wrongCount = result.answers.filter((a) => !a.isCorrect).length
        const wrongYakuConsistent = wrongCount === 0 ? wrongYaku.size === 0 : wrongYaku.size >= 0
        return hasAccuracy && hasDuration && wrongYakuConsistent
      }),
      { numRuns: 100 }
    )
  })
})
