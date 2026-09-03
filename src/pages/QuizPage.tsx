import { useState } from 'react'
import { PageLayout } from '../components/common/PageLayout'
import { QuizBoard } from '../components/quiz/QuizBoard'
import { QuizResult } from '../components/quiz/QuizResult'
import { quizEngine, type QuizSession, type QuizFeedback } from '../modules/quizEngine'
import { progressTracker } from '../modules/progressTracker'
import type { Yaku } from '../types'

type Phase = 'setup' | 'playing' | 'result'

export function QuizPage() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [scope, setScope] = useState<'all' | 'learned'>('all')
  const [count, setCount] = useState(10)
  const [session, setSession] = useState<QuizSession | null>(null)
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null)

  const start = () => {
    const learnedIds = new Set(progressTracker.getProgress().learnedYaku)
    const newSession = quizEngine.startSession(count, scope, learnedIds)
    setSession(newSession)
    setFeedback(null)
    setPhase('playing')
  }

  const handleSubmit = (selectedYaku: Yaku[]) => {
    if (!session) return
    const { session: updated, feedback: fb } = quizEngine.submitAnswer(session, selectedYaku)
    setSession(updated)
    setFeedback(fb)
    quizEngine.saveSession(updated)
  }

  const handleNext = () => {
    if (!session) return
    setFeedback(null)
    if (quizEngine.isComplete(session)) {
      const result = quizEngine.buildResult(session)
      progressTracker.recordQuizResult(result.sessionId, result)
      quizEngine.clearSession()
      setPhase('result')
    }
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-4">役判定クイズ</h1>

      {phase === 'setup' && (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block font-semibold mb-1">出題範囲</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as 'all' | 'learned')}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="all">全役</option>
              <option value="learned">学習済み役のみ</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">問題数</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value={10}>10問</option>
              <option value={20}>20問</option>
            </select>
          </div>
          <button
            onClick={start}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            クイズを開始
          </button>
        </div>
      )}

      {phase === 'playing' && session && session.currentIndex < session.questions.length && (
        <QuizBoard
          question={session.questions[session.currentIndex]}
          questionNumber={session.currentIndex + 1}
          totalQuestions={session.questions.length}
          feedback={feedback}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      )}

      {phase === 'result' && session && (
        <QuizResult result={quizEngine.buildResult(session)} onRestart={() => setPhase('setup')} />
      )}
    </PageLayout>
  )
}

export default QuizPage
