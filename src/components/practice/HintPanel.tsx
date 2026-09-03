import type { HintResult } from '../../types'
import { TileDisplay } from '../common/TileImage'

interface HintPanelProps {
  hint: HintResult | null
  onRequestHint: () => void
}

export function HintPanel({ hint, onRequestHint }: HintPanelProps) {
  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">ヒント</span>
        <button
          onClick={onRequestHint}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          ヒントを見る
        </button>
      </div>
      {hint && (
        <div>
          <p className="text-sm mb-2">{hint.message}</p>
          <div className="flex flex-wrap gap-1">
            {hint.usefulTiles.map((t, i) => (
              <TileDisplay key={`${t.id}-${i}`} tile={t} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HintPanel
