# RPG風ポートフォリオサイト — 開発ロードマップ

> このファイルは「何を作るか」の正本。Phase の定義はここを優先する。
> 進捗の詳細・次の作業は docs/HANDOFF.md を参照。

---

## サイト概要

- 形式: HTML + CSS + JavaScript（フレームワークなし・静的サイト）
- コンセプト: RPG のコマンド選択 UI でページを切り替える就活用ポートフォリオ
- 主ゴール: 採用担当者に「ゲームエンジニア志望」「人間味」「制作姿勢」が伝わるサイトを公開する

### 1 回の訪問の流れ（目標 UX）

1. TOP（ホーム） — 背景 + 床 + キャラクター + コマンドメニュー
2. コマンド選択 — 選んだ項目の詳細パネルに切り替わる（コマンドは非表示）
3. 詳細画面 — ジャンプバーで About / Skills / Works / Contact を移動
4. TOP に戻る — 「戻る」またはジャンプバーの TOP でコマンドを再表示

### 画面状態（設計の中心）

| 状態 ID | 画面 | コマンド表示 | 備考 |
|---------|------|-------------|------|
| top | TOP（キャラ＋背景） | 表示 | 初期画面 |
| about | 自己紹介 | 非表示 | MORE 内に Biography 統合 |
| skills | スキル | 非表示 | |
| works | 制作実績 | 非表示 | 3 作品カード |
| contact | 連絡先 | 非表示 | メール + GitHub API 一覧 |

※ Timeline 画面は廃止。Biography は About の MORE 内に統合済み。

### 技術方針（初心者向け）

- 1 ページ構成 — index.html 1 枚 + JavaScript で画面切り替え
- 状態は 1 変数で管理 — `let currentScreen = 'top'`
- TOP シーンは複数レイヤー重ね — 背景（スクロール）/ 床 / キャラ / コマンド / 詳細パネル
- 参考実装: AIMade_Takahashi_PortfolioSite/takahashi_portfolio_site/（配色・文言・コマンド UI）

### やらないこと（初期版）

- React / Vue などのフレームワーク導入
- バックエンド・データベース
- キャラの自由移動・マップ歩行
- ゲーム本編のような戦闘システム

---

## メインプロジェクト

| 項目 | パス |
|------|------|
| リポジトリルート | Takahashi_Portfolio_WebSite_260615/ |
| 開発対象（本番・現行） | リポジトリ直下（index.html がある場所） |
| 引き継ぎ | docs/HANDOFF.md |
| ロードマップ | docs/ROADMAP.md（このファイル） |
| エントリ | index.html |
| スタイル | css/main_style.css |
| スクリプト | js/main_script.js（接続済み・showScreen 等実装済み） |
| 画像 | assets/images/ |
| 参考サイト | AIMade_Takahashi_PortfolioSite/takahashi_portfolio_site/ |
| 旧作業フォルダ（重複） | HandMade_Takahashi_PortfolioSite/PortfolioSite/ |

### 画像アセット（配置済み）

| 用途 | ファイル名 | パス |
|------|-----------|------|
| 背景（空） | bg.png | assets/images/bg.png |
| 床 | floor.png | assets/images/floor.png |
| キャラクター | character.png | assets/images/character.png |

---

## 現状の実装状況（2026-07-06・コード基準）

### Phase 0 — 準備・設計（完了）

- [x] サイトコンセプト決定（RPG 風コマンド UI）
- [x] 参考サイトの用意（AI 作成版）
- [x] 使用画像の選定・配置
- [x] フォルダ構成（css/, js/, assets/images/, docs/）
- [x] コマンド項目の確定（About / Skills / Works / Contact）
- [x] ファイル名決定（main_style.css / main_script.js）

### Phase 1 — 骨組み（HTML + 画像表示）（完了）

- [x] index.html 作成（#app / #screen-top）
- [x] css/main_style.css 作成（リセット・コメント付き）
- [x] 背景 .scene-bg（タイル横スクロールアニメーション）
- [x] 床 .scene-floor（img + translateY で位置調整）
- [x] キャラ .scene-character（img + bottom / width で位置調整）
- [x] レイヤーの z-index 重ね
- [ ] meta description / OGP タグ（公開前）

### Phase 2 — コマンド UI（完了）

- [x] 吹き出し風コマンドパネルの HTML / CSS
- [x] コマンド項目: About / Skills / Works / Contact
- [x] ホバー・フォーカス時の見た目
- [x] TOP のときだけコマンドを表示（`body.is-detail-open` で非表示）

### Phase 3 — 画面切り替え（JavaScript）（完了）

- [x] js/main_script.js に showScreen() 実装
- [x] index.html から script 読み込み
- [x] currentScreen を 1 変数で管理
- [x] コマンドクリック → 詳細画面へ
- [x] 「戻る」ボタン → top へ（コマンド再表示）
- [x] 詳細表示中はコマンドパネルを非表示
- [x] .detail-panel + .detail-content で詳細表示
- [x] ジャンプバー（TOP / About / Skills / Works / Contact）

### Phase 4 — 各画面の中身（完了）

- [x] About — 短い intro + MORE（自分について / Biography / 強み 3 つ）
- [x] Skills — 技術 4 つ + ツール使用歴
- [x] Works — 制作実績カード 3 作品
- [x] Contact — メールリンク + GitHub プロフィールリンク

### Phase 4.5 — GitHub API（完了）

- [x] Contact 表示時に GitHub API で公開リポジトリ一覧を取得
- [x] `GITHUB_USERNAME = 'Takahashi-02'`
- [x] 空リポジトリ時・取得失敗時のメッセージ表示

### Phase 5 — 見た目・UX 調整（ほぼ完了）

- [x] レスポンシブ 4 段階（デフォルト / 1200px / 768px / 480px）
- [x] キャラは非表示にせず小さく残す
- [x] 1200px 以下でキャラ浮き対策（bottom / left / 床 translateY 調整）
- [x] 768px タブレット向け（コマンド縮小・キャラ中央寄せ）
- [x] 480px スマホ向け
- [ ] 375px 幅での最終確認
- [ ] 任意: prefers-reduced-motion 対応
- [ ] 任意: `@media (hover: hover)` でホバー制御
- [ ] 画面切り替え時のフェード（任意）

### Phase 6 — 公開準備（次）

- [ ] GitHub Pages で公開
- [ ] OGP URL・meta description の実データ化
- [ ] ogp.png 追加（任意）
- [ ] 公開後スマホ・PC で最終確認

### Phase 7 — 拡張（任意・後回し）

- [x] GitHub API でリポジトリ一覧（Phase 4.5 で前倒し完了）
- [ ] Works 動画リンク・スクショ画像
- [ ] キャラの待機アニメーション（CSS）
- [ ] BGM / SE
- ~~Timeline 画面~~（廃止。About MORE に統合）

---

## Phase 実装ステップ（詳細は HANDOFF 参照）

| Step | 内容 | 主なファイル | 状態 |
|------|------|-------------|------|
| 0 | フォルダ・画像 | assets/images/ | 完了 |
| 1 | HTML + レイヤー表示 | index.html, main_style.css | 完了 |
| 2 | コマンド UI | index.html, main_style.css | 完了 |
| 3 | 画面切り替え | main_script.js | 完了 |
| 4 | コンテンツ | index.html | 完了 |
| 4.5 | GitHub API | main_script.js | 完了 |
| 5 | レスポンシブ | main_style.css | ほぼ完了 |
| 6 | 公開 | GitHub Pages | **次** |

---

## レスポンシブ方針（main_style.css）

| ブレークポイント | 対象 | 主な調整 |
|------------------|------|----------|
| デフォルト（1201px〜） | ワイド PC | キャラ left 70%, bottom 8%。床 translateY(16%) |
| max-width: 1200px | やや狭い PC | キャラ left 60%, bottom 5%。床 translateY(14%) |
| max-width: 768px | タブレット | コマンド縮小、キャラ中央寄せ |
| max-width: 480px | スマホ | さらに縮小 |

---

## 参考サイトから借りられるもの

| 参考元 | 借りるもの | 借りないもの |
|--------|-----------|-------------|
| index.html | About / Skills / Works / Contact の文言 | ヘッダーナビ・縦スクロール 1 ページ構成 |
| style.css | 色変数、カード・ボタン、.command-panel | ヒーロー＋全セクション縦並び |
| script.js | GitHub API 部分（実装済み） | スクロール連動ナビ |

---

## 注意メモ

- [i] 開発パスはリポジトリ直下に統一。HandMade_Takahashi_PortfolioSite/ は重複フォルダ（未整理）。
- [i] 床・キャラ位置は手動微調整済み。レスポンシブごとに % 指定で再調整している。
- [i] CSS コメントと実値がズレている箇所あり（floor translateY、character bottom）。任意でコメント修正可。
- [i] Contact の GitHub API は公開リポジトリが 0 件のとき `reposLoaded` は true にならず、再表示時に再取得される。
- [i] 公開前に meta / OGP の URL を GitHub Pages の実 URL に差し替えること。

---

## 開発 Phase 定義

| Phase | 状態 | 概要 |
|-------|------|------|
| 0 | 完了 | 準備・設計・画像配置 |
| 1 | 完了 | HTML + TOP レイヤー表示 |
| 2 | 完了 | コマンド UI |
| 3 | 完了 | JS 画面切り替え |
| 4 | 完了 | コンテンツ |
| 4.5 | 完了 | GitHub API |
| 5 | ほぼ完了 | レスポンシブ |
| 6 | **次** | 公開 |
| 7 | 任意 | 拡張 |

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-06-15 | 初版作成 |
| 2026-06-15 | 現行コード調査。Phase 1 ほぼ完了。開発パスはリポジトリ直下に移行。 |
| 2026-07-06 | Phase 0〜4.5 完了、Phase 5（1200px 含む）ほぼ完了に同期。Phase 6 が次。 |