# 麻雀学習アプリ

麻雀を段階的に学べるブラウザ向けの学習アプリです。牌と基本ルールの学習から、役の学習、役判定クイズ、点数計算、CPU対戦の実践練習まで、5つのモードを自由に行き来しながら学べます。

## 主な機能

- **牌と基本ルールの学習** — 全34種類の牌と基本用語・ゲーム進行を図解で学ぶ
- **役の学習** — 標準役の一覧・成立条件・手牌例をカテゴリ別に確認、キーワード検索対応
- **役判定クイズ** — ランダムな手牌の役を回答し、正誤と解説を確認
- **点数計算の学習** — 符計算のステップ解説と計算練習
- **実践練習（CPU対戦）** — 難易度別の4人麻雀でヒント付きの実戦練習
- **学習進捗の管理** — モードごとの進捗をブラウザに保存し、ダッシュボードで確認
- ダークモード対応 / 日本語UI

学習進捗はサーバーではなくブラウザの localStorage に保存されるため、バックエンドは不要です。

## 技術スタック

- React 19 + TypeScript
- Vite（ビルド・開発サーバー）
- Zustand（状態管理）
- Tailwind CSS（スタイリング / ダークモード）
- Vitest + React Testing Library（ユニットテスト）、fast-check（プロパティテスト）

## 必要な環境

- Node.js 18 以上（推奨: LTS）
- npm

## セットアップ

依存関係をインストールします。

```bash
npm install
```

## 動かし方

### 開発サーバーの起動

```bash
npm run dev
```

起動後、ターミナルに表示される URL（通常 `http://localhost:5173`）をブラウザで開きます。デスクトップブラウザ（Chrome・Firefox・Edge・Safari の最新版）での動作を想定しています。

### 本番ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。

### ビルドのプレビュー

```bash
npm run preview
```

## テスト

```bash
# 全テストを一度だけ実行
npm test

# ウォッチモードで実行
npm run test:watch
```

テストはユニットテストとプロパティベーステスト（fast-check）の二層構成です。

## ディレクトリ構成

```
src/
  components/   UIコンポーネント（common / lessons / yaku / quiz / score / practice / progress）
  pages/        各画面（ホーム・牌・役・クイズ・点数計算・実践練習・進捗）
  modules/      コアロジック（役判定・点数計算・実践練習・進捗管理・クイズ）
  data/         学習コンテンツ（レッスン・役・点数計算の章）
  constants/    牌データ
  store/        Zustand ストア（セッション状態）
  types/        型定義
  __tests__/    ユニットテスト（units）・プロパティテスト（properties）
```

## 仕様ドキュメント

要件・設計・実装計画は `.kiro/specs/mahjong-learning-app/` にまとまっています。

- `requirements.md` — 要件定義
- `design.md` — 設計（アーキテクチャ・画面遷移・正確性プロパティ）
- `tasks.md` — 実装計画
