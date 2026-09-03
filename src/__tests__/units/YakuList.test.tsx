import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { YakuList } from '../../components/yaku/YakuList'
import { YAKU_LIST } from '../../data/yaku'

function renderList() {
  return render(
    <MemoryRouter>
      <YakuList learnedIds={new Set()} />
    </MemoryRouter>
  )
}

describe('YakuList 表示・検索', () => {
  it('初期状態で全役が表示される（要件2.1）', () => {
    renderList()
    for (const yaku of YAKU_LIST) {
      expect(screen.getByText(yaku.name)).toBeInTheDocument()
    }
  })

  it('カテゴリ見出しが表示される（要件2.1）', () => {
    renderList()
    expect(screen.getByText('基本役')).toBeInTheDocument()
    expect(screen.getByText('複合役')).toBeInTheDocument()
    expect(screen.getByText('役満')).toBeInTheDocument()
  })

  it('検索で役が絞り込まれる（要件2.5）', () => {
    renderList()
    const input = screen.getByLabelText('役の検索')
    fireEvent.change(input, { target: { value: 'リーチ' } })
    // リーチは表示され、タンヤオは表示されない
    expect(screen.getByText('リーチ')).toBeInTheDocument()
    expect(screen.queryByText('タンヤオ')).not.toBeInTheDocument()
  })

  it('該当なしの検索で空メッセージを表示する（要件2.5）', () => {
    renderList()
    const input = screen.getByLabelText('役の検索')
    fireEvent.change(input, { target: { value: 'zzzz存在しない役zzzz' } })
    expect(screen.getByText('該当する役がありません。')).toBeInTheDocument()
  })

  it('学習済みマークが表示される', () => {
    render(
      <MemoryRouter>
        <YakuList learnedIds={new Set(['riichi'])} />
      </MemoryRouter>
    )
    const riichiLink = screen.getByText('リーチ').closest('a')!
    expect(within(riichiLink).getByLabelText('学習済み')).toBeInTheDocument()
  })
})
