import type { Tile } from '../types'

// 萬子 (man) 1-9
const manTiles: Tile[] = [
  { id: 'man1', suit: 'man', value: 1, name: '一萬', reading: 'いちまん', altText: '一萬 (いちまん)' },
  { id: 'man2', suit: 'man', value: 2, name: '二萬', reading: 'にまん', altText: '二萬 (にまん)' },
  { id: 'man3', suit: 'man', value: 3, name: '三萬', reading: 'さんまん', altText: '三萬 (さんまん)' },
  { id: 'man4', suit: 'man', value: 4, name: '四萬', reading: 'しまん', altText: '四萬 (しまん)' },
  { id: 'man5', suit: 'man', value: 5, name: '五萬', reading: 'ごまん', altText: '五萬 (ごまん)' },
  { id: 'man6', suit: 'man', value: 6, name: '六萬', reading: 'ろくまん', altText: '六萬 (ろくまん)' },
  { id: 'man7', suit: 'man', value: 7, name: '七萬', reading: 'ななまん', altText: '七萬 (ななまん)' },
  { id: 'man8', suit: 'man', value: 8, name: '八萬', reading: 'はちまん', altText: '八萬 (はちまん)' },
  { id: 'man9', suit: 'man', value: 9, name: '九萬', reading: 'きゅうまん', altText: '九萬 (きゅうまん)' },
]

// 筒子 (pin) 1-9
const pinTiles: Tile[] = [
  { id: 'pin1', suit: 'pin', value: 1, name: '一筒', reading: 'いちぴん', altText: '一筒 (いちぴん)' },
  { id: 'pin2', suit: 'pin', value: 2, name: '二筒', reading: 'にぴん', altText: '二筒 (にぴん)' },
  { id: 'pin3', suit: 'pin', value: 3, name: '三筒', reading: 'さんぴん', altText: '三筒 (さんぴん)' },
  { id: 'pin4', suit: 'pin', value: 4, name: '四筒', reading: 'よんぴん', altText: '四筒 (よんぴん)' },
  { id: 'pin5', suit: 'pin', value: 5, name: '五筒', reading: 'ごぴん', altText: '五筒 (ごぴん)' },
  { id: 'pin6', suit: 'pin', value: 6, name: '六筒', reading: 'ろくぴん', altText: '六筒 (ろくぴん)' },
  { id: 'pin7', suit: 'pin', value: 7, name: '七筒', reading: 'ななぴん', altText: '七筒 (ななぴん)' },
  { id: 'pin8', suit: 'pin', value: 8, name: '八筒', reading: 'はちぴん', altText: '八筒 (はちぴん)' },
  { id: 'pin9', suit: 'pin', value: 9, name: '九筒', reading: 'きゅうぴん', altText: '九筒 (きゅうぴん)' },
]

// 索子 (sou) 1-9
const souTiles: Tile[] = [
  { id: 'sou1', suit: 'sou', value: 1, name: '一索', reading: 'いちそう', altText: '一索 (いちそう)' },
  { id: 'sou2', suit: 'sou', value: 2, name: '二索', reading: 'にそう', altText: '二索 (にそう)' },
  { id: 'sou3', suit: 'sou', value: 3, name: '三索', reading: 'さんそう', altText: '三索 (さんそう)' },
  { id: 'sou4', suit: 'sou', value: 4, name: '四索', reading: 'よんそう', altText: '四索 (よんそう)' },
  { id: 'sou5', suit: 'sou', value: 5, name: '五索', reading: 'ごそう', altText: '五索 (ごそう)' },
  { id: 'sou6', suit: 'sou', value: 6, name: '六索', reading: 'ろくそう', altText: '六索 (ろくそう)' },
  { id: 'sou7', suit: 'sou', value: 7, name: '七索', reading: 'ななそう', altText: '七索 (ななそう)' },
  { id: 'sou8', suit: 'sou', value: 8, name: '八索', reading: 'はちそう', altText: '八索 (はちそう)' },
  { id: 'sou9', suit: 'sou', value: 9, name: '九索', reading: 'きゅうそう', altText: '九索 (きゅうそう)' },
]

// 風牌 (wind) 4種
const windTiles: Tile[] = [
  { id: 'wind_east', suit: 'wind', value: null, name: '東', reading: 'とん', altText: '東 (とん)' },
  { id: 'wind_south', suit: 'wind', value: null, name: '南', reading: 'なん', altText: '南 (なん)' },
  { id: 'wind_west', suit: 'wind', value: null, name: '西', reading: 'しゃー', altText: '西 (しゃー)' },
  { id: 'wind_north', suit: 'wind', value: null, name: '北', reading: 'ぺー', altText: '北 (ぺー)' },
]

// 三元牌 (dragon) 3種
const dragonTiles: Tile[] = [
  { id: 'dragon_haku', suit: 'dragon', value: null, name: '白', reading: 'はく', altText: '白 (はく)' },
  { id: 'dragon_hatsu', suit: 'dragon', value: null, name: '發', reading: 'はつ', altText: '發 (はつ)' },
  { id: 'dragon_chun', suit: 'dragon', value: null, name: '中', reading: 'ちゅん', altText: '中 (ちゅん)' },
]

// 全34種類の牌
export const ALL_TILES: Tile[] = [
  ...manTiles,
  ...pinTiles,
  ...souTiles,
  ...windTiles,
  ...dragonTiles,
]

// IDから牌を検索するユーティリティ
export const getTileById = (id: string): Tile | undefined =>
  ALL_TILES.find((t) => t.id === id)

export { manTiles, pinTiles, souTiles, windTiles, dragonTiles }
