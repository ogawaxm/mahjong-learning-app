import type { Yaku } from '../types'

/**
 * 役リストを検索クエリで絞り込む。
 * クエリが空文字の場合は全件を返す。
 * 名前または説明にクエリ（大文字小文字を無視）が含まれる役のみを返す。
 */
export function searchYaku<T extends Yaku>(query: string, yakuList: T[]): T[] {
  const normalized = query.trim().toLowerCase()
  if (normalized === '') return yakuList
  return yakuList.filter((y) => {
    const name = y.name.toLowerCase()
    const description = y.description.toLowerCase()
    return name.includes(normalized) || description.includes(normalized)
  })
}
