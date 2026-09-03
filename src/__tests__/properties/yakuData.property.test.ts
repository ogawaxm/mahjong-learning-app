import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { YAKU_LIST } from '../../data/yaku'
import { searchYaku } from '../../modules/yakuSearch'

// Feature: mahjong-learning-app, Property 3: 役データが最低2例ずつ含む
describe('Property 3: 役データが最低2例ずつ含む', () => {
  it('すべての役はexamplesValid 2例以上・examplesInvalid 2例以上を持つ', () => {
    fc.assert(
      fc.property(fc.constantFrom(...YAKU_LIST), (yaku) => {
        return yaku.examplesValid.length >= 2 && yaku.examplesInvalid.length >= 2
      }),
      { numRuns: 100 }
    )
  })

  it('データ全体でも各役が2例ずつ持つことを直接確認', () => {
    for (const yaku of YAKU_LIST) {
      expect(yaku.examplesValid.length).toBeGreaterThanOrEqual(2)
      expect(yaku.examplesInvalid.length).toBeGreaterThanOrEqual(2)
    }
  })
})

// Feature: mahjong-learning-app, Property 4: 役検索が合致する役のみ返す
describe('Property 4: 役検索が合致する役のみ返す', () => {
  it('検索結果は元リストのサブセットであり、全要素がクエリを名前か説明に含む', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 10 }), (query) => {
        const result = searchYaku(query, YAKU_LIST)
        const normalized = query.trim().toLowerCase()

        // サブセット確認
        const isSubset = result.every((r) => YAKU_LIST.includes(r))
        if (!isSubset) return false

        // 空クエリの場合は全件
        if (normalized === '') return result.length === YAKU_LIST.length

        // 全要素がクエリを含む
        return result.every(
          (r) =>
            r.name.toLowerCase().includes(normalized) ||
            r.description.toLowerCase().includes(normalized)
        )
      }),
      { numRuns: 100 }
    )
  })

  it('実際の役名の一部で検索すると該当役が含まれる', () => {
    const result = searchYaku('リーチ', YAKU_LIST)
    expect(result.some((y) => y.id === 'riichi')).toBe(true)
  })
})
