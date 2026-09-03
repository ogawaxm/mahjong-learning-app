import type { YakuData } from '../../data/yaku'
import { TilePopup } from '../common/TilePopup'
import { TileDisplay } from '../common/TileImage'
import type { Hand } from '../../types'

interface YakuDetailProps {
  yaku: YakuData
  learned: boolean
  onMarkLearned: () => void
}

function HandRow({ hand }: { hand: Hand }) {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
      {hand.tiles.map((tile, i) => (
        <TilePopup key={`${tile.id}-${i}`} tile={tile}>
          <TileDisplay tile={tile} size="sm" />
        </TilePopup>
      ))}
    </div>
  )
}

export function YakuDetail({ yaku, learned, onMarkLearned }: YakuDetailProps) {
  return (
    <article>
      <div className="flex items-baseline gap-3 mb-2">
        <h1 className="text-2xl font-bold">{yaku.name}</h1>
        <span className="text-gray-500">{yaku.han}飜{yaku.hanOpen === null ? '（門前のみ）' : ''}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{yaku.description}</p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">成立条件</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {yaku.conditions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-400">成立する手牌例</h2>
        <div className="space-y-2">
          {yaku.examplesValid.map((h, i) => (
            <HandRow key={i} hand={h} />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-red-700 dark:text-red-400">成立しない手牌例</h2>
        <div className="space-y-2">
          {yaku.examplesInvalid.map((h, i) => (
            <HandRow key={i} hand={h} />
          ))}
        </div>
      </section>

      <button
        onClick={onMarkLearned}
        disabled={learned}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
      >
        {learned ? '学習済み ✓' : '学習を完了する'}
      </button>
    </article>
  )
}

export default YakuDetail
