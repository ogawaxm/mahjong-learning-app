import { useState } from 'react'
import type { Hand, WinCondition, GameContext } from '../../types'
import { YAKU_LIST } from '../../data/yaku'
import { getTileById } from '../../constants/tiles'
import { TileDisplay } from '../common/TileImage'

export interface ScoreFormValues {
  hand: Hand
  winCondition: WinCondition
  gameContext: GameContext
}

interface ScoreFormProps {
  onCalculate: (values: ScoreFormValues) => void
}

// 例示手牌の選択肢（成立例プール）
const sampleHands = YAKU_LIST.flatMap((y) =>
  y.examplesValid.map((h, i) => ({
    label: `${y.name} 例${i + 1}`,
    hand: h,
  }))
)

const winds = [
  { value: 'east', label: '東' },
  { value: 'south', label: '南' },
  { value: 'west', label: '西' },
  { value: 'north', label: '北' },
] as const

export function ScoreForm({ onCalculate }: ScoreFormProps) {
  const [handIndex, setHandIndex] = useState(0)
  const [winType, setWinType] = useState<'tsumo' | 'ron'>('ron')
  const [roundWind, setRoundWind] = useState<GameContext['roundWind']>('east')
  const [seatWind, setSeatWind] = useState<GameContext['seatWind']>('south')

  const selectedHand = sampleHands[handIndex].hand

  const submit = () => {
    const winningTile = selectedHand.tiles[selectedHand.tiles.length - 1] ?? getTileById('man1')!
    onCalculate({
      hand: selectedHand,
      winCondition: { type: winType, winningTile },
      gameContext: {
        roundWind,
        seatWind,
        isRiichi: false,
        isTsumo: winType === 'tsumo',
        doraIndicators: [],
      },
    })
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className="block font-semibold mb-1">手牌を選択</label>
        <select
          value={handIndex}
          onChange={(e) => setHandIndex(Number(e.target.value))}
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          {sampleHands.map((s, i) => (
            <option key={i} value={i}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
          {selectedHand.tiles.map((t, i) => (
            <TileDisplay key={`${t.id}-${i}`} tile={t} size="sm" />
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">あがり方</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-1">
            <input type="radio" checked={winType === 'ron'} onChange={() => setWinType('ron')} />
            ロン
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={winType === 'tsumo'} onChange={() => setWinType('tsumo')} />
            ツモ
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">場風</label>
          <select
            value={roundWind}
            onChange={(e) => setRoundWind(e.target.value as GameContext['roundWind'])}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {winds.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">自風</label>
          <select
            value={seatWind}
            onChange={(e) => setSeatWind(e.target.value as GameContext['seatWind'])}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {winds.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={submit}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        点数を計算する
      </button>
    </div>
  )
}

export default ScoreForm
