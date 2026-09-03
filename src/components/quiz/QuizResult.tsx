import { Link } from 'react-router-dom'
import type { QuizSessionResult } from '../../types'

interface QuizResultProps {
  result: QuizSessionResult
  onRestart: () => void
}

export function QuizResult({ result, onRestart }: QuizResultProps) {
  const accuracy = result.totalCount > 0 ? Math.round((result.correctCount / result.totalCount) * 100) : 0
  const seconds = Math.round(result.durationMs / 1000)

  // 誤答した役の一覧を集計
  const wrongYaku = new Map<string, string>()
  for (const answer of result.answers) {
    if (!answer.isCorrect) {
      const question = result.questions.find((q) => q.id === answer.questionId)
      for (const y of question?.correctYaku ?? []) {
        wrongYaku.set(y.id, y.name)
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">クイズ結果</h2>

      <dl className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <dt className="text-sm text-gray-500">正答率</dt>
          <dd className="text-2xl font-bold">{accuracy}%</dd>
          <dd className="text-xs text-gray-400">
            {result.correctCount} / {result.totalCount} 問正解
          </dd>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <dt className="text-sm text-gray-500">所要時間</dt>
          <dd className="text-2xl font-bold">{seconds}秒</dd>
        </div>
      </dl>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">誤答した役</h3>
        {wrongYaku.size === 0 ? (
          <p className="text-gray-500 text-sm">誤答はありませんでした。素晴らしい！</p>
        ) : (
          <ul className="space-y-1">
            {[...wrongYaku.entries()].map(([id, name]) => (
              <li key={id}>
                <Link to={`/yaku/${id}`} className="text-blue-600 dark:text-blue-400 underline text-sm">
                  {name} を復習する
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        onClick={onRestart}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        もう一度挑戦する
      </button>
    </div>
  )
}

export default QuizResult
