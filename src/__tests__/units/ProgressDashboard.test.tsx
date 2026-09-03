import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressDashboard } from '../../components/progress/ProgressDashboard'
import { LESSONS } from '../../data/lessons'
import type { UserProgress } from '../../types'

function makeProgress(overrides: Partial<UserProgress> = {}): UserProgress {
  return {
    completedLessons: [],
    learnedYaku: [],
    quizHistory: [],
    practiceHistory: [],
    badges: [],
    lastUpdated: new Date().toISOString(),
    ...overrides,
  }
}

function renderDashboard(progress: UserProgress, rate: number, onReset = () => {}) {
  return render(
    <MemoryRouter>
      <ProgressDashboard progress={progress} completionRate={rate} onReset={onReset} />
    </MemoryRouter>
  )
}

describe('ProgressDashboard', () => {
  it('学習済みレッスン数・クイズ正答率・対戦成績を表示する（要件6.2）', () => {
    renderDashboard(makeProgress({ completedLessons: ['a', 'b'] }), 0.2)
    expect(screen.getByText('学習済みレッスン数')).toBeInTheDocument()
    expect(screen.getByText('クイズ正答率')).toBeInTheDocument()
    expect(screen.getByText('対戦成績')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('全体完了率をパーセンテージで表示する（要件6.3）', () => {
    renderDashboard(makeProgress(), 0.62)
    expect(screen.getByText('62% 完了')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '62')
  })

  it('全レッスン完了時にバッジを表示する（要件6.4）', () => {
    const allLessons = LESSONS.map((l) => l.id)
    renderDashboard(makeProgress({ completedLessons: allLessons }), 1.0)
    expect(screen.getByLabelText(/バッジ: 全レッスン完了/)).toBeInTheDocument()
  })

  it('リセットは確認ダイアログの後に実行される（要件6.5）', () => {
    let resetCalled = false
    renderDashboard(makeProgress({ completedLessons: ['a'] }), 0.1, () => { resetCalled = true })
    // 最初のクリックでは確認表示のみ
    fireEvent.click(screen.getByRole('button', { name: '進捗をリセット' }))
    expect(resetCalled).toBe(false)
    expect(screen.getByText(/本当に進捗データを削除しますか/)).toBeInTheDocument()
    // 確認後に実行
    fireEvent.click(screen.getByRole('button', { name: '削除する' }))
    expect(resetCalled).toBe(true)
  })
})
