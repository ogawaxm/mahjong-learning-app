import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/common/PageLayout'
import { GameBoard } from '../components/practice/GameBoard'
import { HintPanel } from '../components/practice/HintPanel'
import { CPUActionLog } from '../components/practice/CPUActionLog'
import { practiceEngine } from '../modules/practiceEngine'
import { progressTracker } from '../modules/progressTracker'
import type { GameState, Difficulty, Tile, HintResult, PracticeResult } from '../types'

type Phase = 'select' | 'playing' | 'result'

const difficultyLabels: Record<Difficulty, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
}

export function PracticePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('select')
  const [state, setState] = useState<GameState | null>(null)
  const [hint, setHint] = useState<HintResult | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<PracticeResult | null>(null)

  const startGame = (difficulty: Difficulty) => {
    const newState = practiceEngine.startGame(difficulty)
    setState(newState)
    setPhase('playing')
    setLogs([`対局開始（難易度: ${difficultyLabels[difficulty]}）`])
  }

  const finishGame = (finalState: GameState) => {
    const r = practiceEngine.buildResult(finalState)
    progressTracker.recordPracticeResult(r)
    setResult(r)
    setPhase('result')
  }

  const handleDiscard = async (tile: Tile) => {
    if (!state) return
    const afterDiscard = practiceEngine.processPlayerDiscard(state, tile)
    setLogs((l) => [...l, `あなたが ${tile.name} を打牌`])
    setState(afterDiscard)

    const afterCPU = await practiceEngine.processCPUTurn(afterDiscard)
    // CPU打牌のログを生成
    const cpuLogs: string[] = []
    for (let i = 1; i <= 3; i++) {
      const pile = afterCPU.discardPiles[i]
      const last = pile[pile.length - 1]
      if (last) cpuLogs.push(`CPU${i} が ${last.name} を打牌`)
    }
    setLogs((l) => [...l, ...cpuLogs])
    setState(afterCPU)
    practiceEngine.saveGameState(afterCPU)

    if (afterCPU.phase === 'end') {
      finishGame(afterCPU)
    }
  }

  const requestHint = () => {
    if (!state) return
    setHint(practiceEngine.getHint(state.players[0].hand))
  }

  const handleInterrupt = () => {
    if (state) practiceEngine.saveGameState(state)
    const ok = window.confirm('対局を中断してホームに移動しますか？（進行状況は保存されます）')
    if (ok) navigate('/')
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">実践練習</h1>
        {phase === 'playing' && (
          <button
            onClick={handleInterrupt}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            中断する
          </button>
        )}
      </div>

      {phase === 'select' && (
        <div className="space-y-4 max-w-md">
          <p className="text-gray-600 dark:text-gray-400">難易度を選択してください。</p>
          <div className="flex gap-3">
            {(Object.keys(difficultyLabels) as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => startGame(d)}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {difficultyLabels[d]}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'playing' && state && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <GameBoard state={state} onDiscard={handleDiscard} />
          </div>
          <div className="space-y-4">
            <HintPanel hint={hint} onRequestHint={requestHint} />
            <CPUActionLog logs={logs} />
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold">対局結果</h2>
          <dl className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">順位</dt>
              <dd className="font-bold">{result.rank}位</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">最終点数</dt>
              <dd className="font-bold">{result.finalScore}点</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">出現した役</dt>
              <dd>{result.yakuEncountered.length > 0 ? result.yakuEncountered.join('・') : 'なし'}</dd>
            </div>
          </dl>
          <button
            onClick={() => setPhase('select')}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            もう一度
          </button>
        </div>
      )}
    </PageLayout>
  )
}

export default PracticePage
