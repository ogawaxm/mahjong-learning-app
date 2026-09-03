import { useState, useRef, useEffect } from 'react'
import type { Tile } from '../../types'
import { TileDisplay } from './TileImage'

interface TilePopupProps {
  tile: Tile
  children: React.ReactNode
}

const suitLabels: Record<string, string> = {
  man: '萬子',
  pin: '筒子',
  sou: '索子',
  wind: '風牌',
  dragon: '三元牌',
}

export function TilePopup({ tile, children }: TilePopupProps) {
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <span className="relative inline-block" ref={popupRef}>
      <span
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="cursor-pointer"
      >
        {children}
      </span>

      {open && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 text-sm"
        >
          <div className="flex justify-center mb-2">
            <TileDisplay tile={tile} size="lg" />
          </div>
          <dl className="space-y-1">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">名称</dt>
              <dd className="font-bold text-gray-900 dark:text-gray-100">{tile.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">読み方</dt>
              <dd className="text-gray-700 dark:text-gray-300">{tile.reading}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">分類</dt>
              <dd className="text-gray-700 dark:text-gray-300">{suitLabels[tile.suit] ?? tile.suit}</dd>
            </div>
          </dl>
          {/* ポップアップの矢印 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-300 dark:border-t-gray-600" />
        </div>
      )}
    </span>
  )
}

export default TilePopup
