import { useState } from 'react'
import type { UserProgress } from '../../types'
import { Badge } from '../common/Badge'
import { LESSONS } from '../../data/lessons'

interface ProgressDashboardProps {
  progress: UserProgress
  completionRate: number // 0.0 〜 1.0
  onReset: () => void
}

function calcQuizAccuracy(progress: UserProgress): number {
  const totals = progress.quizHistory.reduce(
    (acc, s) => ({ correct: acc.correct + s.correctCount, total: acc.total + s.totalCount }),
    { correct: 0, total: 0 }
  )
  return totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : 0
}

export function ProgressDashboard({ progress, completionRate, onReset }: ProgressDashboardProps) {
  const [confirming, setConfirming] = useState(false)
  const percentage = Math.round(completionRate * 100)
  const quizAccuracy = calcQuizAccuracy(progress)
  const allLessonsComplete = progress.completedLessons.length >= LESSONS.length

  return (
    <div className="space-y-6">
      {/* 全体完了率 */}
      <section>
        <h2 className="font-semibold mb-2">全体の進捗</h2>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-4 transition-all"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{percentage}% 完了</p>
      </section>

      {/* 統計 */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-500">学習済みレッスン数</p>
          <p className="text-2xl font-bold">{progress.completedLessons.length}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-500">クイズ正答率</p>
          <p className="text-2xl font-bold">{quizAccuracy}%</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-500">対戦成績</p>
          <p className="text-2xl font-bold">{progress.practiceHistory.length}戦</p>
        </div>
      </section>

      {/* バッジ */}
      {allLessonsComplete && (
        <section>
          <Badge title="全レッスン完了" description="すべてのレッスンを学習しました" />
        </section>
      )}

      {/* リセット */}
      <section>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="px-4 py-2 rounded border border-red-400 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            進捗をリセット
          </button>
        ) : (
          <div className="p-4 border border-red-400 rounded-lg">
            <p className="mb-3">本当に進捗データを削除しますか？この操作は取り消せません。</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onReset()
                  setConfirming(false)
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                削除する
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default ProgressDashboard
