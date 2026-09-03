import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ScorePage } from '../../pages/ScorePage'
import { SCORE_CHAPTERS } from '../../data/scoreChapters'

beforeEach(() => localStorage.clear())

function renderPage() {
  return render(
    <MemoryRouter>
      <ScorePage />
    </MemoryRouter>
  )
}

describe('ScorePage 必須コンテンツ', () => {
  it('符計算の解説章がすべて存在する（要件4.1）', () => {
    expect(SCORE_CHAPTERS.length).toBe(5)
    const titles = SCORE_CHAPTERS.map((c) => c.title)
    expect(titles).toContain('基本符')
    expect(titles).toContain('面子符')
    expect(titles).toContain('雀頭符')
    expect(titles).toContain('あがり符')
  })

  it('点数表の章が存在する（要件4.2）', () => {
    expect(SCORE_CHAPTERS.some((c) => c.title === '点数表の読み方')).toBe(true)
  })

  it('解説タブに最初の章が表示される（要件4.1）', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 2, name: '基本符' })).toBeInTheDocument()
  })

  it('計算練習タブに切り替えると計算ボタンが表示される（要件4.3）', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '計算練習' }))
    expect(screen.getByRole('button', { name: '点数を計算する' })).toBeInTheDocument()
  })
})
