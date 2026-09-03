# 実装計画: 麻雀学習アプリ

## 概要

React（TypeScript）+ Zustand + Tailwind CSS + Vite のスタック構成で、クライアントサイド完結型の麻雀学習 SPA を段階的に構築する。コアモジュール → UI コンポーネント → 各学習モード → 統合の順で実装する。

## タスク

- [x] 1. プロジェクト基盤とコアデータ型の整備
  - Vite + React + TypeScript + Tailwind CSS + Zustand プロジェクトを作成する
  - `src/types/index.ts` に `Tile`, `Hand`, `Meld`, `Yaku`, `GameContext`, `WinCondition`, `QuizQuestion`, `QuizSessionResult`, `QuizAnswer`, `GameState`, `Player`, `UserProgress`, `PracticeResult`, `SessionState` の型定義を実装する
  - `src/constants/tiles.ts` に全34種類の牌データ（数牌27種・字牌7種）を定義する
  - Vitest + React Testing Library + fast-check をテスト依存関係として追加する
  - _要件: 1.1, 7.5_

- [x] 2. 進捗管理モジュールの実装
  - [x] 2.1 `src/modules/progressTracker.ts` に `ProgressTracker` インターフェースを実装する
    - `markLessonComplete`, `markYakuLearned`, `recordQuizResult`, `recordPracticeResult`, `getProgress`, `resetProgress`, `calculateCompletionRate` を実装する
    - localStorage へのシリアライズ・デシリアライズ（`mahjong_progress_*` キー）を実装する
    - _要件: 1.5, 2.4, 6.1, 6.3, 6.5_

  - [x] 2.2 プロパティテスト: 進捗記録ラウンドトリップ
    - **プロパティ2: 進捗記録ラウンドトリップ**
    - **検証: 要件 1.5, 2.4**

  - [x] 2.3 プロパティテスト: localStorage 永続化ラウンドトリップ
    - **プロパティ14: 進捗データ localStorage 永続化ラウンドトリップ**
    - **検証: 要件 6.1**

  - [x] 2.4 プロパティテスト: 完了率の範囲
    - **プロパティ16: 完了率が 0〜100% の範囲に収まる**
    - **検証: 要件 6.3**

  - [x] 2.5 プロパティテスト: リセット後に進捗が空になる
    - **プロパティ17: リセット後に進捗が空になる**
    - **検証: 要件 6.5**

- [x] 3. 共通 UI コンポーネントの実装
  - [x] 3.1 `src/components/common/TileImage.tsx` を実装する
    - `Tile` データから牌画像を表示し、`altText` プロパティを img の alt 属性に設定する
    - _要件: 1.1, 7.3_

  - [x] 3.2 プロパティテスト: TileImage が alt 属性を持つ
    - **プロパティ18: TileImage が alt 属性を持つ**
    - **検証: 要件 7.3**

  - [x] 3.3 `src/components/common/TilePopup.tsx` を実装する
    - 牌タップ時に名称・読み方・suit をすべて表示するポップアップを実装する
    - _要件: 1.2_

  - [x] 3.4 プロパティテスト: 牌ポップアップが必要情報を含む
    - **プロパティ1: 牌ポップアップが必要情報を含む**
    - **検証: 要件 1.2**

  - [x] 3.5 `src/components/common/NavBar.tsx` を実装する
    - 全ページで常時表示されるナビゲーションバーを実装する
    - ダークモード切り替えボタンを含める
    - _要件: 7.4_

  - [x] 3.6 `src/components/common/Badge.tsx` を実装する
    - 全レッスン完了時に表示されるバッジコンポーネントを実装する
    - _要件: 6.4_

- [x] 4. チェックポイント — ここまでのテストを通す
  - すべてのテストが通ることを確認する。疑問点があればユーザーに確認する。

- [x] 5. 役データとコア判定ロジックの実装
  - [x] 5.1 `src/data/yaku.ts` に標準36役のデータを定義する
    - 各役は `examplesValid` が2例以上、`examplesInvalid` が2例以上含まれるようにする
    - _要件: 2.1, 2.2, 2.3_

  - [x] 5.2 プロパティテスト: 役データが最低2例ずつ含む
    - **プロパティ3: 役データが最低2例ずつ含む**
    - **検証: 要件 2.3**

  - [x] 5.3 `src/modules/yakuSearch.ts` に `searchYaku(query, yakuList)` 関数を実装する
    - 役名・説明へのキーワード一致フィルタリングを実装する
    - _要件: 2.5_

  - [x] 5.4 プロパティテスト: 役検索が合致する役のみ返す
    - **プロパティ4: 役検索が合致する役のみ返す**
    - **検証: 要件 2.5**

  - [x] 5.5 `src/modules/yakuEngine.ts` に `YakuEngine` を実装する
    - `detectYaku(hand, context)` と `isWinningHand(hand)` を実装する
    - _要件: 3.1, 3.2, 4.3_

- [x] 6. 点数計算モジュールの実装
  - [x] 6.1 `src/modules/scoreCalculator.ts` に `ScoreCalculator` を実装する
    - `calculate(hand, winCondition, gameContext)` を実装し、han・fu・totalPoints・breakdown を返す
    - あがりが成立しない場合にエラーを返す処理を実装する
    - _要件: 4.3, 4.4, 4.5_

  - [x] 6.2 プロパティテスト: ScoreCalculator が計算結果と内訳を返す
    - **プロパティ9: ScoreCalculator が計算結果と内訳を返す**
    - **検証: 要件 4.3, 4.4**

  - [x] 6.3 プロパティテスト: 不正手牌でエラーが返る
    - **プロパティ10: 不正手牌でエラーが返る**
    - **検証: 要件 4.5**

- [x] 7. 牌と基本ルールの学習モードを実装する
  - [x] 7.1 `src/data/lessons.ts` に10レッスン分のコンテンツデータを定義する
    - 萬子・筒子・索子・風牌・三元牌・ツモロン・リーチ・ポンチー・カン・ゲーム進行の各レッスンデータ
    - _要件: 1.1, 1.3, 1.4_

  - [x] 7.2 `src/components/lessons/LessonCard.tsx` と `LessonViewer.tsx` を実装する
    - レッスン一覧カードと本文（テキスト・図解）表示コンポーネントを実装する
    - _要件: 1.1, 1.3_

  - [x] 7.3 `src/pages/TilesPage.tsx` と `src/pages/LessonPage.tsx` を実装する
    - レッスン一覧と個別レッスンページを実装し、完了時に `markLessonComplete` を呼ぶ
    - _要件: 1.1, 1.3, 1.4, 1.5_

  - [x] 7.4 ユニットテスト: 各レッスンページの必須コンテンツが存在する
    - `src/__tests__/units/LessonPage.test.tsx` を実装する
    - _要件: 1.1, 1.3, 1.4_

- [x] 8. 役の学習モードを実装する
  - [x] 8.1 `src/components/yaku/YakuList.tsx` を実装する
    - カテゴリ別一覧表示と `searchYaku` を使ったキーワード検索機能を実装する
    - _要件: 2.1, 2.5_

  - [x] 8.2 `src/components/yaku/YakuDetail.tsx` を実装する
    - 成立条件・飜数・手牌例（成立/不成立）の表示を実装する
    - 学習完了ボタンを設け `markYakuLearned` を呼ぶ
    - _要件: 2.2, 2.3, 2.4_

  - [x] 8.3 `src/pages/YakuPage.tsx` と `src/pages/YakuDetailPage.tsx` を実装する
    - _要件: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 8.4 ユニットテスト: 役一覧の検索・表示
    - `src/__tests__/units/YakuList.test.tsx` を実装する
    - _要件: 2.1, 2.5_

- [x] 9. チェックポイント — ここまでのテストを通す
  - すべてのテストが通ることを確認する。疑問点があればユーザーに確認する。

- [x] 10. 役判定クイズモードを実装する
  - [x] 10.1 `src/modules/quizEngine.ts` にクイズセッション管理ロジックを実装する
    - `YakuEngine` を使って手牌を生成し、複数役の正解受け付けロジックを実装する
    - セッション中断・再開のための localStorage 保存・復元を実装する
    - _要件: 3.1, 3.3, 3.6_

  - [x] 10.2 `src/components/quiz/QuizBoard.tsx` を実装する
    - 手牌表示・役選択・回答送信 UI を実装する
    - 誤回答時に対応役のレッスンリンクを表示する
    - _要件: 3.1, 3.2, 3.4_

  - [x] 10.3 プロパティテスト: クイズ回答フィードバックが解説を含む
    - **プロパティ5: クイズ回答フィードバックが解説を含む**
    - **検証: 要件 3.2**

  - [x] 10.4 プロパティテスト: 誤回答時に対応レッスンリンクが表示される
    - **プロパティ6: 誤回答時に対応レッスンリンクが表示される**
    - **検証: 要件 3.4**

  - [x] 10.5 プロパティテスト: 複数役手牌で部分一致を正解とする
    - **プロパティ8: 複数役手牌で部分一致を正解とする**
    - **検証: 要件 3.6**

  - [x] 10.6 `src/components/quiz/QuizResult.tsx` を実装する
    - 正答率・所要時間・誤答した役の一覧を表示する
    - _要件: 3.5_

  - [x] 10.7 プロパティテスト: クイズ結果に必要情報が含まれる
    - **プロパティ7: クイズ結果に必要情報が含まれる**
    - **検証: 要件 3.5**

  - [x] 10.8 `src/pages/QuizPage.tsx` を実装する
    - クイズ開始設定（出題範囲・問題数）→ 問題 → 結果の画面遷移を実装する
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 10.9 ユニットテスト: クイズセッションに10問以上含まれる
    - `src/__tests__/units/QuizBoard.test.tsx` を実装する
    - _要件: 3.3_

- [x] 11. 点数計算学習モードを実装する
  - [x] 11.1 `src/data/scoreChapters.ts` に符計算5章のコンテンツデータを定義する
    - 基本符・面子符・雀頭符・あがり符・点数表の各章データ
    - _要件: 4.1, 4.2_

  - [x] 11.2 `src/components/score/ScoreForm.tsx` を実装する
    - 手牌・あがり方（ツモ/ロン）・場風・自風の入力フォームを実装する
    - _要件: 4.3_

  - [x] 11.3 `src/components/score/ScoreBreakdown.tsx` を実装する
    - 符・飜数・合計点数の計算内訳を表示する
    - あがり不成立時に「あがりが成立しません」メッセージを表示する
    - _要件: 4.4, 4.5_

  - [x] 11.4 `src/pages/ScorePage.tsx` を実装する
    - 解説章 → 計算練習の画面フローを実装する
    - _要件: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 11.5 ユニットテスト: 点数計算ページの必須コンテンツ
    - `src/__tests__/units/ScorePage.test.tsx` を実装する
    - _要件: 4.1, 4.2_

- [x] 12. チェックポイント — ここまでのテストを通す
  - すべてのテストが通ることを確認する。疑問点があればユーザーに確認する。

- [x] 13. 実践練習エンジンの実装
  - [x] 13.1 `src/modules/practiceEngine.ts` に `PracticeEngine` を実装する
    - `startGame`, `processPlayerDiscard`, `processCPUTurn`, `getHint`, `saveGameState`, `loadGameState` を実装する
    - CPU思考は難易度別のヒューリスティック（初級: ランダム打牌、中級: 不要牌優先、上級: シャンテン数計算）で実装する
    - ゲーム状態を `mahjong_progress_practice` キーで localStorage に保存する
    - _要件: 5.1, 5.2, 5.3, 5.4, 5.6_

  - [x] 13.2 プロパティテスト: CPUターンが1秒以内に完了する
    - **プロパティ11: CPUターンが1秒以内に完了する**
    - **検証: 要件 5.3**

  - [x] 13.3 プロパティテスト: GameState save/load ラウンドトリップ
    - **プロパティ13: GameState save/load ラウンドトリップ**
    - **検証: 要件 5.6**

  - [x] 13.4 プロパティテスト: ゲーム結果に順位・点数・役が含まれる
    - **プロパティ12: ゲーム結果に順位・点数・役が含まれる**
    - **検証: 要件 5.5**

- [x] 14. 実践練習 UI の実装
  - [x] 14.1 `src/components/practice/GameBoard.tsx` を実装する
    - 手牌エリア・捨て牌エリアを実装する
    - 打牌時に `processPlayerDiscard` を呼び、結果の GameState を表示する
    - _要件: 5.1_

  - [x] 14.2 `src/components/practice/HintPanel.tsx` を実装する
    - `getHint` を使ってあがりに近い牌の情報を表示する
    - _要件: 5.4_

  - [x] 14.3 `src/components/practice/CPUActionLog.tsx` を実装する
    - CPU の直近操作履歴を表示する
    - _要件: 5.1_

  - [x] 14.4 `src/pages/PracticePage.tsx` を実装する
    - 難易度選択 → 対局 → 結果の画面フローを実装する
    - 中断時のナビゲーション確認ダイアログを実装する
    - `recordPracticeResult` を対局終了時に呼ぶ
    - _要件: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [x] 14.5 ユニットテスト: 実践練習ページの必須コンテンツ
    - `src/__tests__/units/PracticePage.test.tsx` を実装する
    - _要件: 5.1, 5.2, 5.4_

- [x] 15. 進捗ダッシュボードの実装
  - [x] 15.1 `src/components/progress/ProgressDashboard.tsx` を実装する
    - 学習済みレッスン数・クイズ正答率・対戦成績を表示する
    - 全体完了率をパーセンテージで表示するプログレスバーを実装する
    - 全レッスン完了時に `Badge` コンポーネントを表示する
    - 進捗リセットボタンと確認ダイアログを実装する
    - _要件: 6.2, 6.3, 6.4, 6.5_

  - [x] 15.2 プロパティテスト: ダッシュボードが必要情報を含む
    - **プロパティ15: ダッシュボードが必要情報を含む**
    - **検証: 要件 6.2**

  - [x] 15.3 `src/pages/ProgressPage.tsx` を実装する
    - _要件: 6.2, 6.3, 6.4, 6.5_

  - [x] 15.4 ユニットテスト: 進捗ダッシュボード
    - `src/__tests__/units/ProgressDashboard.test.tsx` を実装する
    - _要件: 6.2, 6.3, 6.4_

- [x] 16. ホーム画面と全体統合
  - [x] 16.1 `src/pages/HomePage.tsx` を実装する
    - 5つのモードカード（牌と基本ルール・役の学習・役判定クイズ・点数計算・実践練習）を実装する
    - `ModeCardProps` と `ModeProgress` インターフェースに従いカードコンポーネントを実装する
    - 全体進捗バーを実装する
    - _要件: 6.2, 6.3_

  - [x] 16.2 `src/App.tsx` にルーティング（React Router）を設定し全ページを接続する
    - `/`, `/tiles`, `/tiles/:lessonId`, `/yaku`, `/yaku/:yakuId`, `/quiz`, `/score`, `/practice`, `/progress` の全ルートを実装する
    - Zustand ストアで SessionState の保存・復元を実装する
    - _要件: 1.5, 2.4, 3.1, 4.1, 5.1, 6.1_

  - [x] 16.3 Tailwind CSS でダークモード対応を実装する
    - `prefers-color-scheme: dark` でクラスを切り替える設定を `tailwind.config.ts` に追加する
    - NavBar にダークモード切り替えトグルを実装する
    - _要件: 7.4_

  - [x] 16.4 ユニットテスト: ダークモード切り替えとアクセシビリティ
    - `src/__tests__/units/` にダークモード切り替えテストと axe-core による WCAG コントラスト比確認を実装する
    - _要件: 7.2, 7.4_

- [x] 17. 最終チェックポイント — すべてのテストを通す
  - すべてのテストが通ることを確認する。疑問点があればユーザーに確認する。

## 注意事項

- `*` 付きのサブタスクはオプション（スキップ可能）
- 各タスクは要件のトレーサビリティを持つ
- チェックポイントで段階的に品質を確認する
- プロパティテストは fast-check で実装し、各テスト最低100回反復する
- ユニットテストは Vitest + React Testing Library で実装する
