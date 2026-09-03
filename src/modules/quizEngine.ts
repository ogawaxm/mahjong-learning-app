import type { QuizQuestion, QuizAnswer, QuizSessionResult, Yaku, GameContext } from '../types'
import { YAKU_LIST, type YakuData } from '../data/yaku'
import { createYakuEngine } from './yakuEngine'

const STORAGE_KEY = 'mahjong_progress_quiz_session'
const engine = createYakuEngine()

const context: GameContext = {
  roundWind: 'east',
  seatWind: 'south',
  isRiichi: false,
  isTsumo: false,
  doraIndicators: [],
}

export interface QuizFeedback {
  isCorrect: boolean
  correctYaku: Yaku[]
  explanation: string
  lessonLinks: { yakuId: string; label: string; href: string }[]
}

export interface QuizSession {
  sessionId: string
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  currentIndex: number
  startedAt: number
}

// 役の成立例を利用してクイズ問題を生成する
function generateQuestions(count: number, scope: 'all' | 'learned', learnedIds: Set<string>): QuizQuestion[] {
  const pool: YakuData[] = scope === 'learned'
    ? YAKU_LIST.filter((y) => learnedIds.has(y.id))
    : YAKU_LIST
  const source = pool.length > 0 ? pool : YAKU_LIST

  const questions: QuizQuestion[] = []
  for (let i = 0; i < count; i++) {
    const yaku = source[i % source.length]
    const example = yaku.examplesValid[i % yaku.examplesValid.length]
    // 実際に検出される役をすべて正解とする（複数役対応）
    const correctYaku = engine.detectYaku(example, context)
    questions.push({
      id: `q_${i}_${yaku.id}`,
      hand: example,
      correctYaku: correctYaku.length > 0 ? correctYaku : [yaku],
    })
  }
  return questions
}

export interface QuizEngine {
  startSession(count: number, scope: 'all' | 'learned', learnedIds: Set<string>): QuizSession
  submitAnswer(session: QuizSession, selectedYaku: Yaku[]): { session: QuizSession; feedback: QuizFeedback }
  isComplete(session: QuizSession): boolean
  buildResult(session: QuizSession): QuizSessionResult
  saveSession(session: QuizSession): void
  loadSession(): QuizSession | null
  clearSession(): void
}

export function createQuizEngine(): QuizEngine {
  function startSession(count: number, scope: 'all' | 'learned', learnedIds: Set<string>): QuizSession {
    // 要件3.3: 最低10問
    const finalCount = Math.max(count, 10)
    return {
      sessionId: `session_${Date.now()}`,
      questions: generateQuestions(finalCount, scope, learnedIds),
      answers: [],
      currentIndex: 0,
      startedAt: Date.now(),
    }
  }

  function submitAnswer(session: QuizSession, selectedYaku: Yaku[]) {
    const question = session.questions[session.currentIndex]
    const correctIds = new Set(question.correctYaku.map((y) => y.id))
    // 要件3.6: いずれか1つ以上の役が一致すれば正解（部分一致）
    const isCorrect = selectedYaku.some((y) => correctIds.has(y.id))

    const answer: QuizAnswer = {
      questionId: question.id,
      selectedYaku,
      isCorrect,
    }

    const explanation = isCorrect
      ? `正解です。この手牌には ${question.correctYaku.map((y) => y.name).join('・')} が成立します。`
      : `不正解です。正しい役は ${question.correctYaku.map((y) => y.name).join('・')} です。`

    const lessonLinks = isCorrect
      ? []
      : question.correctYaku.map((y) => ({
          yakuId: y.id,
          label: `${y.name} のレッスンを見る`,
          href: `/yaku/${y.id}`,
        }))

    const feedback: QuizFeedback = {
      isCorrect,
      correctYaku: question.correctYaku,
      explanation,
      lessonLinks,
    }

    const updatedSession: QuizSession = {
      ...session,
      answers: [...session.answers, answer],
      currentIndex: session.currentIndex + 1,
    }

    return { session: updatedSession, feedback }
  }

  function isComplete(session: QuizSession): boolean {
    return session.currentIndex >= session.questions.length
  }

  function buildResult(session: QuizSession): QuizSessionResult {
    const correctCount = session.answers.filter((a) => a.isCorrect).length
    return {
      sessionId: session.sessionId,
      questions: session.questions,
      answers: session.answers,
      correctCount,
      totalCount: session.questions.length,
      durationMs: Date.now() - session.startedAt,
      completedAt: new Date().toISOString(),
    }
  }

  function saveSession(session: QuizSession): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      console.warn('クイズセッションの保存に失敗しました')
    }
  }

  function loadSession(): QuizSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as QuizSession) : null
    } catch {
      return null
    }
  }

  function clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // noop
    }
  }

  return {
    startSession,
    submitAnswer,
    isComplete,
    buildResult,
    saveSession,
    loadSession,
    clearSession,
  }
}

export const quizEngine = createQuizEngine()
