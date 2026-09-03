import { useState } from 'react'
import { PageLayout } from '../components/common/PageLayout'
import { ScoreForm, type ScoreFormValues } from '../components/score/ScoreForm'
import { ScoreBreakdown } from '../components/score/ScoreBreakdown'
import { SCORE_CHAPTERS } from '../data/scoreChapters'
import { scoreCalculator, ScoreCalculationError } from '../modules/scoreCalculator'
import type { ScoreResult } from '../types'

type Tab = 'chapters' | 'calc'

export function ScorePage() {
  const [tab, setTab] = useState<Tab>('chapters')
  const [chapterIndex, setChapterIndex] = useState(0)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = (values: ScoreFormValues) => {
    try {
      const r = scoreCalculator.calculate(values.hand, values.winCondition, values.gameContext)
      setResult(r)
      setError(null)
    } catch (e) {
      setResult(null)
      setError(e instanceof ScoreCalculationError ? e.message : '計算中にエラーが発生しました')
    }
  }

  const chapter = SCORE_CHAPTERS[chapterIndex]

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-4">点数計算の学習</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTab('chapters')}
          className={`px-4 py-2 ${tab === 'chapters' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          解説
        </button>
        <button
          onClick={() => setTab('calc')}
          className={`px-4 py-2 ${tab === 'calc' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          計算練習
        </button>
      </div>

      {tab === 'chapters' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {SCORE_CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setChapterIndex(i)}
                className={`px-3 py-1 rounded border ${
                  i === chapterIndex ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {i + 1}. {c.title}
              </button>
            ))}
          </div>
          <article>
            <h2 className="text-xl font-bold mb-2">{chapter.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{chapter.body}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {chapter.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </article>
          <button
            onClick={() => setChapterIndex((i) => Math.min(i + 1, SCORE_CHAPTERS.length - 1))}
            disabled={chapterIndex >= SCORE_CHAPTERS.length - 1}
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
          >
            次の章へ
          </button>
        </div>
      )}

      {tab === 'calc' && (
        <div className="space-y-6">
          <ScoreForm onCalculate={handleCalculate} />
          <ScoreBreakdown result={result} error={error} />
        </div>
      )}
    </PageLayout>
  )
}

export default ScorePage
