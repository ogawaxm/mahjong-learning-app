import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { NavBar } from '../../components/common/NavBar'
import { Badge } from '../../components/common/Badge'
import { TileImage } from '../../components/common/TileImage'
import { ALL_TILES } from '../../constants/tiles'

beforeEach(() => {
  document.documentElement.classList.remove('dark')
})

describe('ダークモード切り替え（要件7.4）', () => {
  it('トグルボタンでhtml要素にdarkクラスが付与・除去される', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    )
    const toggle = screen.getByRole('button', { name: /ダークモードに切り替え/ })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    fireEvent.click(toggle)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    // もう一度押すとライトに戻る
    const toggleBack = screen.getByRole('button', { name: /ライトモードに切り替え/ })
    fireEvent.click(toggleBack)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

describe('アクセシビリティ（要件7.2, 7.3）', () => {
  it('NavBarにアクセシビリティ違反がない', async () => {
    const { container } = render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    )
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('Badgeにアクセシビリティ違反がない', async () => {
    const { container } = render(<Badge title="全レッスン完了" />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('TileImageは画像に代替テキストを持つ（要件7.3）', async () => {
    const { container } = render(<TileImage tile={ALL_TILES[0]} />)
    const img = container.querySelector('img')!
    expect(img.getAttribute('alt')).toBeTruthy()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
