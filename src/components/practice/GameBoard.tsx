import type { GameState, Tile } from '../../types'
import { TileDisplay } from '../common/TileImage'

interface GameBoardProps {
  state: GameState
  onDiscard: (tile: Tile) => void
}

export function GameBoard({ state, onDiscard }: GameBoardProps) {
  const human = state.players[0]
  const canDiscard = state.currentTurn === 0 && state.phase !== 'end'

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        {state.turnNumber}巡目 / 残り山牌: {state.wall.length}枚
      </div>

      {/* CPU捨て牌エリア */}
      <div className="grid grid-cols-1 gap-2">
        {state.players.slice(1).map((p, i) => (
          <div key={p.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="text-xs text-gray-500">CPU{i + 1} の捨て牌</span>
            <div className="flex flex-wrap gap-0.5 mt-1">
              {state.discardPiles[i + 1].map((t, j) => (
                <TileDisplay key={`${t.id}-${j}`} tile={t} size="sm" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 自分の捨て牌 */}
      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
        <span className="text-xs text-gray-500">あなたの捨て牌</span>
        <div className="flex flex-wrap gap-0.5 mt-1">
          {state.discardPiles[0].map((t, j) => (
            <TileDisplay key={`${t.id}-${j}`} tile={t} size="sm" />
          ))}
        </div>
      </div>

      {/* 手牌 */}
      <div>
        <span className="text-sm font-semibold">あなたの手牌{canDiscard ? '（クリックで打牌）' : ''}</span>
        <div className="flex flex-wrap gap-1 mt-2">
          {human.hand.tiles.map((tile, i) => (
            <button
              key={`${tile.id}-${i}`}
              onClick={() => canDiscard && onDiscard(tile)}
              disabled={!canDiscard}
              className="disabled:opacity-60 hover:-translate-y-1 transition-transform"
              aria-label={`${tile.name}を打牌`}
            >
              <TileDisplay tile={tile} size="md" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameBoard
