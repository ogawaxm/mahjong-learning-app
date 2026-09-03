import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { render, fireEvent } from '@testing-library/react'
import { createElement } from 'react'
import { TilePopup } from '../../components/common/TilePopup'
import { TileDisplay } from '../../components/common/TileImage'
import type { Tile, TileSuit } from '../../types'

const suitLabels: Record<string, string> = {
  man: '萬子',
  pin: '筒子',
  sou: '索子',
  wind: '風牌',
  dragon: '三元牌',
}

// arbitrary: Tile（名称・読みは他の文字と区別できる十分な長さ）
const arbitraryTile = (): fc.Arbitrary<Tile> =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 30 }),
    suit: fc.constantFrom<TileSuit>('man', 'pin', 'sou', 'wind', 'dragon'),
    value: fc.option(fc.integer({ min: 1, max: 9 }), { nil: null }),
    name: fc.stringMatching(/^[一二三四五六七八九東南西北白發中萬筒索]{1,5}$/),
    reading: fc.stringMatching(/^[ぁ-ん]{2,10}$/),
    altText: fc.string({ minLength: 1, maxLength: 50 }),
  })

// Feature: mahjong-learning-app, Property 1: 牌ポップアップが必要情報を含む
describe('Property 1: 牌ポップアップが必要情報を含む', () => {
  it('タップ後のポップアップは名称・読み方・分類をすべて含む', () => {
    fc.assert(
      fc.property(arbitraryTile(), (tile) => {
        const { container, getByRole, unmount } = render(
          createElement(
            TilePopup,
            { tile, children: createElement(TileDisplay, { tile }) }
          )
        )
        // タップ操作
        const trigger = getByRole('button')
        fireEvent.click(trigger)

        const text = container.textContent ?? ''
        const hasName = text.includes(tile.name)
        const hasReading = text.includes(tile.reading)
        const hasSuit = text.includes(suitLabels[tile.suit])

        unmount()
        return hasName && hasReading && hasSuit
      }),
      { numRuns: 100 }
    )
  })
})
