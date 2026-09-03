import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { TileImage } from '../../components/common/TileImage'
import type { Tile, TileSuit } from '../../types'

// arbitrary: Tile
const arbitraryTile = (): fc.Arbitrary<Tile> =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 30 }),
    suit: fc.constantFrom<TileSuit>('man', 'pin', 'sou', 'wind', 'dragon'),
    value: fc.option(fc.integer({ min: 1, max: 9 }), { nil: null }),
    name: fc.string({ minLength: 1, maxLength: 10 }),
    reading: fc.string({ minLength: 1, maxLength: 20 }),
    altText: fc.string({ minLength: 1, maxLength: 50 }),
  })

// Feature: mahjong-learning-app, Property 18: TileImage が alt 属性を持つ
describe('Property 18: TileImage が alt 属性を持つ', () => {
  it('任意のTileに対してTileImageはalt属性を持つimg要素を含む', () => {
    fc.assert(
      fc.property(arbitraryTile(), (tile) => {
        const { container } = render(TileImage({ tile }))
        const img = container.querySelector('img')
        return img !== null && img.getAttribute('alt') !== null && img.getAttribute('alt') !== ''
      }),
      { numRuns: 100 }
    )
  })

  it('altTextがimg要素のalt属性に反映される', () => {
    fc.assert(
      fc.property(arbitraryTile(), (tile) => {
        const { container } = render(TileImage({ tile }))
        const img = container.querySelector('img')
        return img !== null && img.getAttribute('alt') === tile.altText
      }),
      { numRuns: 100 }
    )
  })
})
