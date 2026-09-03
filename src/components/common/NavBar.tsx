import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/', label: 'ホーム' },
  { href: '/tiles', label: '牌と基本ルール' },
  { href: '/yaku', label: '役の学習' },
  { href: '/quiz', label: '役判定クイズ' },
  { href: '/score', label: '点数計算' },
  { href: '/practice', label: '実践練習' },
  { href: '/progress', label: '進捗' },
]

export function NavBar() {
  const location = useLocation()
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-lg text-gray-900 dark:text-gray-100 shrink-0">
          🀄 麻雀学習
        </Link>
        <ul className="flex flex-wrap gap-1 text-sm">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                to={href}
                className={`px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  location.pathname === href
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          aria-label={dark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          onClick={() => setDark((v) => !v)}
          className="shrink-0 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}

export default NavBar
