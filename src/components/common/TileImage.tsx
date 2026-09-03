import type { Tile } from '../../types'

interface TileImageProps {
  tile: Tile
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-10 text-xs',
  md: 'w-12 h-16 text-sm',
  lg: 'w-16 h-20 text-base',
}

const suitColors: Record<string, string> = {
  man: 'text-red-600 dark:text-red-400',
  pin: 'text-blue-600 dark:text-blue-400',
  sou: 'text-green-600 dark:text-green-400',
  wind: 'text-gray-700 dark:text-gray-300',
  dragon: 'text-purple-700 dark:text-purple-300',
}

export function TileImage({ tile, size = 'md', className = '' }: TileImageProps) {
  const sizeClass = sizeClasses[size]
  const colorClass = suitColors[tile.suit] ?? ''

  return (
    <img
      src={`/tiles/${tile.id}.svg`}
      alt={tile.altText}
      title={tile.name}
      className={`${sizeClass} ${colorClass} inline-block object-contain border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 ${className}`}
      onError={(e) => {
        // SVGが存在しない場合はテキストフォールバック
        const target = e.currentTarget
        target.style.display = 'none'
        const fallback = target.nextElementSibling as HTMLElement | null
        if (fallback) fallback.style.display = 'flex'
      }}
    />
  )
}

interface TileDisplayProps {
  tile: Tile
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// SVGがない環境向けのテキストフォールバック付きラッパー
export function TileDisplay({ tile, size = 'md', className = '' }: TileDisplayProps) {
  const sizeClass = sizeClasses[size]
  const colorClass = suitColors[tile.suit] ?? ''

  return (
    <span className={`relative inline-block ${className}`}>
      <img
        src={`/tiles/${tile.id}.svg`}
        alt={tile.altText}
        title={tile.name}
        className={`${sizeClass} inline-block object-contain border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800`}
        onError={(e) => {
          const target = e.currentTarget
          target.style.display = 'none'
          const fallback = target.nextElementSibling as HTMLElement | null
          if (fallback) fallback.style.display = 'flex'
        }}
      />
      <span
        className={`${sizeClass} ${colorClass} hidden flex-col items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-bold`}
        aria-hidden="true"
      >
        {tile.name}
      </span>
    </span>
  )
}

export default TileImage
