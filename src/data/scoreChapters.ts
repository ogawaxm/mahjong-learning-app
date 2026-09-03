export interface ScoreChapter {
  id: string
  title: string
  body: string
  points: string[]
}

export const SCORE_CHAPTERS: ScoreChapter[] = [
  {
    id: 'chapter_base_fu',
    title: '基本符',
    body: 'あがりの基礎となる符です。すべてのあがりには基本符として20符が与えられます。',
    points: ['基本符は20符', '七対子は例外的に25符固定'],
  },
  {
    id: 'chapter_meld_fu',
    title: '面子符',
    body: '刻子・槓子の種類と牌によって加算される符です。',
    points: [
      '中張牌の明刻: 2符 / 暗刻: 4符',
      '幺九牌の明刻: 4符 / 暗刻: 8符',
      '槓子はさらに符が高い',
      '順子には符が付かない',
    ],
  },
  {
    id: 'chapter_pair_fu',
    title: '雀頭符',
    body: '役牌が雀頭の場合に加算される符です。',
    points: ['役牌（三元牌・場風・自風）の雀頭は2符', '数牌・オタ風の雀頭は0符'],
  },
  {
    id: 'chapter_win_fu',
    title: 'あがり符',
    body: 'あがり方や待ちの形によって加算される符です。',
    points: ['門前ロン: 10符', 'ツモ: 2符', 'ペンチャン・カンチャン・単騎待ち: 2符'],
  },
  {
    id: 'chapter_score_table',
    title: '点数表の読み方',
    body: '飜数と符から点数を求める方法を学びます。',
    points: [
      '基本点 = 符 × 2^(2+飜)',
      '子のロンは基本点×4、親のロンは基本点×6',
      '満貫以上は固定点数',
    ],
  },
]

export function getChapterById(id: string): ScoreChapter | undefined {
  return SCORE_CHAPTERS.find((c) => c.id === id)
}
