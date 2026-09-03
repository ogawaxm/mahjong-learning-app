import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PracticePage } from '../../pages/PracticePage'

beforeEach(() => localStorage.clear())

function renderPage() {
  return render(
    <MemoryRouter>
      <PracticePage />
    </MemoryRouter>
  )
}

describe('PracticePage 必須コンテンツ', () => {
  it('難易度選択が3段階表示される（要件5.2）', () => {
    renderPage()
    expect(screen.getByRole('button', { name: '初級' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '中級' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '上級' })).toBeInTheDocument()
  })

  it('難易度選択後に対局画面へ遷移し手牌が表示される（要件5.1）', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '初級' }))
    expect(screen.getByText('あなたの手牌（クリックで打牌）')).toBeInTheDocument()
  })

  it('対局中にヒント機能が提供される（要件5.4）', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '初級' }))
    const hintButton = screen.getByRole('button', { name: 'ヒントを見る' })
    expect(hintButton).toBeInTheDocument()
    fireEvent.click(hintButton)
    expect(screen.getByText(/あがりまで約/)).toBeInTheDocument()
  })

  it('対局中に中断ボタンが表示される（要件5.6）', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '初級' }))
    expect(screen.getByRole('button', { name: '中断する' })).toBeInTheDocument()
  })
})
