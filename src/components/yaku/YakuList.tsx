import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { YAKU_LIST, YAKU_CATEGORIES, type YakuCategory, type YakuData } from '../../data/yaku'
import { searchYaku } from '../../modules/yakuSearch'

interface YakuListProps {
  learnedIds: Set<string>
}

export function YakuList({ learnedIds }: YakuListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => searchYaku(query, YAKU_LIST), [query])

  const byCategory = useMemo(() => {
    const groups: Record<YakuCategory, YakuData[]> = { basic: [], compound: [], yakuman: [] }
    for (const y of filtered) groups[y.category].push(y)
    return groups
  }, [filtered])

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="役名・説明で検索"
        aria-label="役の検索"
        className="w-full mb-6 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      />

      {(Object.keys(byCategory) as YakuCategory[]).map((cat) =>
        byCategory[cat].length > 0 ? (
          <section key={cat} className="mb-6">
            <h2 className="text-lg font-bold mb-2">{YAKU_CATEGORIES[cat]}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {byCategory[cat].map((yaku) => (
                <li key={yaku.id}>
                  <Link
                    to={`/yaku/${yaku.id}`}
                    className="block border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{yaku.name}</span>
                      <span className="text-sm text-gray-500">
                        {yaku.han}飜
                        {learnedIds.has(yaku.id) && (
                          <span className="ml-2 text-green-600 dark:text-green-400" aria-label="学習済み">✓</span>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{yaku.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}

      {filtered.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">該当する役がありません。</p>
      )}
    </div>
  )
}

export default YakuList
