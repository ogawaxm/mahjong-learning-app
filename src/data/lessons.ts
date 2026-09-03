import type { Tile } from '../types'
import { manTiles, pinTiles, souTiles, windTiles, dragonTiles } from '../constants/tiles'

export interface LessonSection {
  heading: string
  body: string
}

export interface Lesson {
  id: string
  title: string
  summary: string
  tiles: Tile[] // レッスンで扱う牌（図解用）
  sections: LessonSection[]
}

export const LESSONS: Lesson[] = [
  {
    id: 'lesson_manzu',
    title: '萬子（マンズ）',
    summary: '1〜9の数牌「萬子」を学びます。',
    tiles: manTiles,
    sections: [
      { heading: '萬子とは', body: '漢数字と「萬」の字で表される数牌です。一萬から九萬まで9種類あります。' },
      { heading: '読み方', body: 'いちまん・にまん…と読みます。ワンズと呼ぶこともあります。' },
    ],
  },
  {
    id: 'lesson_pinzu',
    title: '筒子（ピンズ）',
    summary: '1〜9の数牌「筒子」を学びます。',
    tiles: pinTiles,
    sections: [
      { heading: '筒子とは', body: '丸い円（筒）の数で表される数牌です。一筒から九筒まで9種類あります。' },
      { heading: '読み方', body: 'いちぴん・にぴん…と読みます。' },
    ],
  },
  {
    id: 'lesson_souzu',
    title: '索子（ソーズ）',
    summary: '1〜9の数牌「索子」を学びます。',
    tiles: souTiles,
    sections: [
      { heading: '索子とは', body: '竹（索）の本数で表される数牌です。一索だけは鳥の絵柄になっています。' },
      { heading: '読み方', body: 'いちそう・にそう…と読みます。' },
    ],
  },
  {
    id: 'lesson_wind',
    title: '風牌',
    summary: '東南西北の4種類の風牌を学びます。',
    tiles: windTiles,
    sections: [
      { heading: '風牌とは', body: '東（とん）・南（なん）・西（しゃー）・北（ぺー）の4種類の字牌です。' },
      { heading: '役割', body: '自分の席と場に対応する風牌は役になります。' },
    ],
  },
  {
    id: 'lesson_dragon',
    title: '三元牌',
    summary: '白發中の3種類の三元牌を学びます。',
    tiles: dragonTiles,
    sections: [
      { heading: '三元牌とは', body: '白（はく）・發（はつ）・中（ちゅん）の3種類の字牌です。' },
      { heading: '役割', body: 'これらの刻子はそれぞれ1飜の役牌になります。' },
    ],
  },
  {
    id: 'lesson_tsumo_ron',
    title: 'ツモ・ロン',
    summary: 'あがり方の基本を学びます。',
    tiles: [],
    sections: [
      { heading: 'ツモ', body: '自分で引いた牌であがることをツモと言います。' },
      { heading: 'ロン', body: '他家の捨て牌であがることをロンと言います。' },
    ],
  },
  {
    id: 'lesson_riichi',
    title: 'リーチ',
    summary: 'リーチの掛け方を学びます。',
    tiles: [],
    sections: [
      { heading: 'リーチとは', body: '門前でテンパイしたときに宣言できる1飜役です。' },
      { heading: '条件', body: '1000点棒を供託し、以降は手牌を変えられません。' },
    ],
  },
  {
    id: 'lesson_pon_chi',
    title: 'ポン・チー',
    summary: '鳴き（副露）の基本を学びます。',
    tiles: [],
    sections: [
      { heading: 'ポン', body: '他家の捨て牌で刻子を作る鳴きです。誰からでも鳴けます。' },
      { heading: 'チー', body: '上家の捨て牌で順子を作る鳴きです。' },
    ],
  },
  {
    id: 'lesson_kan',
    title: 'カン',
    summary: 'カンの種類を学びます。',
    tiles: [],
    sections: [
      { heading: '暗槓', body: '手牌の4枚を自分でカンすることです。' },
      { heading: '明槓', body: '他家の牌を使ってカンすることです。大明槓・加槓があります。' },
    ],
  },
  {
    id: 'lesson_game_flow',
    title: 'ゲームの進行順序',
    summary: '配牌からあがりまでの流れを学びます。',
    tiles: [],
    sections: [
      { heading: '配牌', body: '各プレイヤーに13枚が配られます。' },
      { heading: 'ツモ・打牌', body: '順番に牌を1枚引き、1枚捨てる動作を繰り返します。' },
      { heading: 'あがり', body: '4面子1雀頭を完成させてあがります。' },
    ],
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}
