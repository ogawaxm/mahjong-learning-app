import type { Yaku, Hand, Tile } from '../types'
import { getTileById } from '../constants/tiles'

// タイルID配列からHandを生成するヘルパー
function hand(...ids: string[]): Hand {
  const tiles: Tile[] = ids.map((id) => {
    const t = getTileById(id)
    if (!t) throw new Error(`未知の牌ID: ${id}`)
    return t
  })
  return { tiles }
}

// 役カテゴリ
export type YakuCategory = 'basic' | 'compound' | 'yakuman'

export interface YakuData extends Yaku {
  category: YakuCategory
}

// 各役は examplesValid 2例以上・examplesInvalid 2例以上を持つ
// （手牌例は学習用の代表例。判定ロジックの厳密検証は yakuEngine のテストで行う）
export const YAKU_LIST: YakuData[] = [
  {
    id: 'riichi', name: 'リーチ', category: 'basic', han: 1, hanOpen: null,
    description: '門前でテンパイした際に宣言できる役。',
    conditions: ['門前であること', 'テンパイしていること', '1000点を供託すること'],
    examplesValid: [
      hand('man2', 'man3', 'man4', 'pin5', 'pin5', 'pin5', 'sou7', 'sou8', 'sou9', 'man1', 'man1', 'pin2', 'pin3', 'pin4'),
      hand('pin1', 'pin2', 'pin3', 'sou4', 'sou5', 'sou6', 'man7', 'man8', 'man9', 'sou2', 'sou2', 'man2', 'man3', 'man4'),
    ],
    examplesInvalid: [
      hand('man1', 'man1', 'man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou1', 'sou2', 'sou3', 'sou5', 'sou6', 'sou8'),
      hand('man1', 'man2', 'man3', 'man4', 'man5', 'man6', 'man7', 'man8', 'man9', 'pin1', 'pin1', 'pin2', 'pin3', 'sou9'),
    ],
  },
  {
    id: 'tanyao', name: 'タンヤオ', category: 'basic', han: 1, hanOpen: 1,
    description: '2〜8の数牌のみで構成された手牌。',
    conditions: ['1・9・字牌を含まないこと'],
    examplesValid: [
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('man2', 'man2', 'man2', 'pin3', 'pin4', 'pin5', 'sou6', 'sou7', 'sou8', 'man5', 'man5', 'pin6', 'pin7', 'pin8'),
    ],
    examplesInvalid: [
      hand('man1', 'man2', 'man3', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('wind_east', 'wind_east', 'wind_east', 'pin3', 'pin4', 'pin5', 'sou6', 'sou7', 'sou8', 'man5', 'man5', 'pin6', 'pin7', 'pin8'),
    ],
  },
  {
    id: 'pinfu', name: 'ピンフ', category: 'basic', han: 1, hanOpen: null,
    description: '4つの順子・役牌でない雀頭・両面待ちで構成された門前手。',
    conditions: ['門前であること', '4面子すべて順子', '雀頭が役牌でない', '両面待ちであること'],
    examplesValid: [
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('pin1', 'pin2', 'pin3', 'sou4', 'sou5', 'sou6', 'man7', 'man8', 'man9', 'sou2', 'sou2', 'man2', 'man3', 'man4'),
    ],
    examplesInvalid: [
      hand('man2', 'man2', 'man2', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('dragon_haku', 'dragon_haku', 'man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man7', 'man8'),
    ],
  },
  {
    id: 'iipeikou', name: '一盃口', category: 'basic', han: 1, hanOpen: null,
    description: '同じ順子が2組ある門前手。',
    conditions: ['門前であること', '同一の順子が2組あること'],
    examplesValid: [
      hand('man2', 'man3', 'man4', 'man2', 'man3', 'man4', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('pin1', 'pin2', 'pin3', 'pin1', 'pin2', 'pin3', 'man7', 'man8', 'man9', 'sou2', 'sou2', 'sou5', 'sou6', 'sou7'),
    ],
    examplesInvalid: [
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('man1', 'man2', 'man3', 'man4', 'man5', 'man6', 'man7', 'man8', 'man9', 'pin1', 'pin1', 'sou7', 'sou8', 'sou9'),
    ],
  },
  {
    id: 'yakuhai_haku', name: '役牌 白', category: 'basic', han: 1, hanOpen: 1,
    description: '白の刻子・槓子。',
    conditions: ['白の刻子または槓子があること'],
    examplesValid: [
      hand('dragon_haku', 'dragon_haku', 'dragon_haku', 'man2', 'man3', 'man4', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('dragon_haku', 'dragon_haku', 'dragon_haku', 'pin1', 'pin2', 'pin3', 'sou7', 'sou8', 'sou9', 'man5', 'man5', 'man7', 'man8', 'man9'),
    ],
    examplesInvalid: [
      hand('dragon_hatsu', 'dragon_hatsu', 'dragon_hatsu', 'man2', 'man3', 'man4', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
    ],
  },
  {
    id: 'chiitoitsu', name: '七対子', category: 'compound', han: 2, hanOpen: null,
    description: '7種類の対子で構成された門前手。',
    conditions: ['門前であること', '7組の対子で構成されること'],
    examplesValid: [
      hand('man1', 'man1', 'man3', 'man3', 'pin2', 'pin2', 'pin5', 'pin5', 'sou4', 'sou4', 'sou7', 'sou7', 'dragon_chun', 'dragon_chun'),
      hand('man2', 'man2', 'man5', 'man5', 'pin1', 'pin1', 'pin9', 'pin9', 'sou3', 'sou3', 'sou6', 'sou6', 'wind_east', 'wind_east'),
    ],
    examplesInvalid: [
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('man1', 'man1', 'man1', 'man3', 'man3', 'pin2', 'pin2', 'pin5', 'pin5', 'sou4', 'sou4', 'sou7', 'sou7', 'sou7'),
    ],
  },
  {
    id: 'sanshoku', name: '三色同順', category: 'compound', han: 2, hanOpen: 1,
    description: '3種類の数牌で同じ数の順子を作る。',
    conditions: ['萬子・筒子・索子で同じ並びの順子があること'],
    examplesValid: [
      hand('man2', 'man3', 'man4', 'pin2', 'pin3', 'pin4', 'sou2', 'sou3', 'sou4', 'man6', 'man6', 'pin7', 'pin8', 'pin9'),
      hand('man5', 'man6', 'man7', 'pin5', 'pin6', 'pin7', 'sou5', 'sou6', 'sou7', 'sou1', 'sou1', 'man1', 'man2', 'man3'),
    ],
    examplesInvalid: [
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('man2', 'man3', 'man4', 'man5', 'man6', 'man7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
    ],
  },
  {
    id: 'ittsuu', name: '一気通貫', category: 'compound', han: 2, hanOpen: 1,
    description: '同一種の数牌で123・456・789を揃える。',
    conditions: ['同一種の数牌で1〜9の3順子を作ること'],
    examplesValid: [
      hand('man1', 'man2', 'man3', 'man4', 'man5', 'man6', 'man7', 'man8', 'man9', 'pin2', 'pin2', 'sou7', 'sou8', 'sou9'),
      hand('pin1', 'pin2', 'pin3', 'pin4', 'pin5', 'pin6', 'pin7', 'pin8', 'pin9', 'man3', 'man3', 'sou3', 'sou4', 'sou5'),
    ],
    examplesInvalid: [
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
      hand('man1', 'man2', 'man3', 'man4', 'man5', 'man6', 'sou7', 'sou8', 'sou9', 'pin2', 'pin2', 'sou1', 'sou2', 'sou3'),
    ],
  },
  {
    id: 'daisangen', name: '大三元', category: 'yakuman', han: 13, hanOpen: 13,
    description: '白・發・中の3種類すべてを刻子または槓子で揃える役満。',
    conditions: ['白・發・中すべての刻子または槓子があること'],
    examplesValid: [
      hand('dragon_haku', 'dragon_haku', 'dragon_haku', 'dragon_hatsu', 'dragon_hatsu', 'dragon_hatsu', 'dragon_chun', 'dragon_chun', 'dragon_chun', 'man2', 'man3', 'man4', 'pin5', 'pin5'),
      hand('dragon_haku', 'dragon_haku', 'dragon_haku', 'dragon_hatsu', 'dragon_hatsu', 'dragon_hatsu', 'dragon_chun', 'dragon_chun', 'dragon_chun', 'sou7', 'sou8', 'sou9', 'man1', 'man1'),
    ],
    examplesInvalid: [
      hand('dragon_haku', 'dragon_haku', 'dragon_haku', 'dragon_hatsu', 'dragon_hatsu', 'dragon_hatsu', 'man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou1', 'sou1'),
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
    ],
  },
  {
    id: 'tsuuiisou', name: '字一色', category: 'yakuman', han: 13, hanOpen: 13,
    description: '字牌のみで構成された役満。',
    conditions: ['すべて字牌で構成されること'],
    examplesValid: [
      hand('wind_east', 'wind_east', 'wind_east', 'wind_south', 'wind_south', 'wind_south', 'dragon_haku', 'dragon_haku', 'dragon_haku', 'dragon_chun', 'dragon_chun', 'dragon_chun', 'wind_north', 'wind_north'),
      hand('wind_west', 'wind_west', 'wind_west', 'wind_north', 'wind_north', 'wind_north', 'dragon_hatsu', 'dragon_hatsu', 'dragon_hatsu', 'dragon_chun', 'dragon_chun', 'dragon_chun', 'wind_east', 'wind_east'),
    ],
    examplesInvalid: [
      hand('wind_east', 'wind_east', 'wind_east', 'wind_south', 'wind_south', 'wind_south', 'dragon_haku', 'dragon_haku', 'dragon_haku', 'man2', 'man3', 'man4', 'pin5', 'pin5'),
      hand('man2', 'man3', 'man4', 'pin5', 'pin6', 'pin7', 'sou3', 'sou4', 'sou5', 'man6', 'man6', 'pin2', 'pin3', 'pin4'),
    ],
  },
]

export const YAKU_CATEGORIES: Record<YakuCategory, string> = {
  basic: '基本役',
  compound: '複合役',
  yakuman: '役満',
}

export function getYakuById(id: string): YakuData | undefined {
  return YAKU_LIST.find((y) => y.id === id)
}
