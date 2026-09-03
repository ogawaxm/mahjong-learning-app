import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { QuizQuestion, Yaku } from '../../types'
import type { QuizFeedback } from '../../modules/quizEngine'
import { YAKU_LIST } from '../../data/yaku'
import { TilePopup } from '../common/TilePopup'
import { TileDisplay } from '../common/TileImage'

interface QuizBoardProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  feedback: QuizFeedback | null
  onSubmit: (selectedYaku: Yaku[]) => void
  onNext: () => void
}

export function QuizBoard({
  question,
  questionNumber,
  totalQuestions,
  feedback,
  onSubmit,
  onNext,
}: QuizBoardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = () => {
    const selectedYaku = YAKU_LIST.filter((y) => selected.has(y.id))
    onSubmit(selectedYaku)
  }

  const handleNext = () => {
    setSelected(new Set())
    onNext()
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">
        問題 {questionNumber} / {totalQuestions}
      </p>

      <div className="flex flex-wrap gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
        {question.hand.tiles.map((tile, i) => (
          <TilePopup key={`${tile.id}-${i}`} tile={tile}>
            <TileDisplay tile={tile} size="md" />
          </TilePopup>
        ))}
      </div>

      {!feedback ? (
        <>
          <p className="font-semibold mb-2">成立している役を選んでください</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {YAKU_LIST.map((y) => (
              <button
                key={y.id}
                onClick={() => toggle(y.id)}
                className={`px-3 py-1 rounded border transition-colors ${
                  selected.has(y.id)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {y.name}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
          >
            回答する
          </button>
        </>
      ) : (
        <div
          className={`p-4 rounded-lg border ${
            feedback.isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border-green-400'
              : 'bg-red-50 dark:bg-red-900/20 border-red-400'
          }`}
        >
          <p className="font-bold mb-1">{feedback.isCorrect ? '⭕ 正解' : '❌ 不正解'}</p>
          <p className="text-sm mb-2">{feedback.explanation}</p>
          {feedback.lessonLinks.length > 0 && (
            <ul className="mb-3 space-y-1">
              {feedback.lessonLinks.map((link) => (
                <li key={link.yakuId}>
                  <Link to={link.href} className="text-blue-600 dark:text-blue-400 underline text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizBoard
