# 開発引き継ぎ（HANDOFF）

> 作業のたびにこのファイルを更新する。
> 別 PC・別エージェントは、まずこのファイルを読んで続きを行う。

---

## 最終更新

- 日付: 2026-07-06
- 作業 PC / 担当: 髙橋勇喜（任意）
- 現在の Phase: Phase 5 ほぼ完了 → **Phase 6（GitHub Pages 公開）が次**
- ステータス: 全画面・画面切り替え・Contact GitHub 一覧まで動作。レスポンシブ 1200 / 768 / 480 調整済み
- 設計メモ: 本番はリポジトリ直下。1 ページ構成。Timeline 廃止、Biography は About MORE 内

---

## いま動いていること（1〜3行）

index.html をブラウザで開くと TOP（背景スクロール・床・キャラ・コマンド）が表示される。About / Skills / Works / Contact を選ぶと詳細パネルに切り替わり、ジャンプバーで画面移動・戻るで TOP に戻れる。Contact では GitHub 公開リポジトリ一覧を API 取得する。

---

## 完了したこと（チェックリスト）

### Phase 0：準備・設計
- [x] サイトコンセプト決定（RPG 風・コマンド選択）
- [x] 画面フロー方針（TOP → 詳細 → TOP でコマンド再表示）
- [x] 使用画像の選定・配置
- [x] 参考サイトの配置（AIMade_Takahashi_PortfolioSite/）
- [x] フォルダ構成（css/, js/, assets/images/, docs/）
- [x] コマンド項目の確定（About / Skills / Works / Contact）
- [x] ファイル名決定（main_style.css, main_script.js）

### Phase 1：骨組み
- [x] index.html（#app, #screen-top, レイヤー構成）
- [x] css/main_style.css（リセット + レイヤー配置）
- [x] 背景 .scene-bg（タイル横スクロール）
- [x] 床 .scene-floor
- [x] キャラ .scene-character
- [ ] meta / OGP タグ（公開前）

### Phase 2：コマンド UI
- [x] 吹き出し風 .command-panel
- [x] About / Skills / Works / Contact ボタン
- [x] TOP のときだけコマンド表示（`body.is-detail-open` で非表示）

### Phase 3：画面切り替え
- [x] main_script.js に showScreen()
- [x] index.html から script 読み込み
- [x] .detail-panel + .detail-content（data-content 属性で切替）
- [x] ジャンプバー .jump-bar
- [x] 戻るボタン .btn-back
- [x] 詳細中はコマンド非表示・キャラは右下に小さく残す

### Phase 4：各画面コンテンツ
- [x] About — intro + MORE（自分について / Biography / 強み 3 つ）
- [x] Skills — 技術 4 つ + ツール使用歴
- [x] Works — 3 作品カード
- [x] Contact — メール + GitHub プロフィールリンク

### Phase 4.5：GitHub API
- [x] loadGitHubRepos() 実装
- [x] Contact 表示時に 1 回だけ取得
- [x] #repoList にカード表示

### Phase 5：レスポンシブ
- [x] @media (max-width: 1200px) — キャラ浮き対策
- [x] @media (max-width: 768px) — タブレット
- [x] @media (max-width: 480px) — スマホ
- [ ] 375px 幅での最終確認
- [ ] 任意: prefers-reduced-motion / hover メディアクエリ

### Phase 6：公開（次）
- [ ] GitHub Pages 設定
- [ ] meta / OGP の実 URL 化
- [ ] 公開後スマホ実機確認

---

## 決めたこと・やらないこと

### 決めたこと
- 技術: HTML + CSS + JavaScript（フレームワークなし）
- 本番パス: リポジトリ直下（index.html がある場所）
- UI: RPG 風。キャラ 1 体 + 吹き出し風コマンド
- TOP レイアウト: 背景スクロール / 床 img / キャラ img / コマンド / 詳細パネル
- コマンド: About / Skills / Works / Contact（4 項目）
- コマンド表示ルール: 詳細画面では非表示。TOP に戻ったら再表示
- 詳細中のキャラ: 消さず右下に小さく残す（`body.is-detail-open .scene-character`）
- 詳細 UI: `.detail-panel` オーバーレイ + ジャンプバー
- Timeline: 廃止。Biography は About の MORE 内
- GitHub 一覧: Contact で API 取得（Phase 4.5 で実装済み）
- 画像: bg.png / floor.png / character.png
- CSS / JS: main_style.css / main_script.js
- 参考: AIMade_Takahashi_PortfolioSite/takahashi_portfolio_site/

### 未決定（任意・後回し可）
- [ ] HandMade_Takahashi_PortfolioSite/ を削除 or アーカイブするか
- [ ] Works スクショ・動画リンクの追加タイミング
- [ ] ogp.png の作成

### やらないこと
- フレームワーク導入（初期版）
- キャラの自由移動・マップ歩行
- バックエンド API の自前実装

---

## 画面・状態設計

### 現行 HTML 構造（index.html・要約）

    <div id="app">
      <div id="screen-top" class="screen is-active">
        <div class="scene-bg">…横スクロールタイル…</div>
        <img class="scene-floor" … />
        <img class="scene-character" … />
        <aside class="command-panel">…4 コマンド…</aside>
        <nav class="jump-bar is-hidden">…TOP/About/Skills/Works/Contact…</nav>
        <section class="detail-panel is-hidden">
          <button class="btn-back">戻る</button>
          <div class="detail-panel__body">
            <article class="detail-content" data-content="about">…</article>
            <article class="detail-content is-hidden" data-content="skills">…</article>
            <article class="detail-content is-hidden" data-content="works">…</article>
            <article class="detail-content is-hidden" data-content="contact">…</article>
          </div>
        </section>
      </div>
    </div>

### レイヤー（main_style.css・PC デフォルト）

| クラス | 手段 | 備考 |
|--------|------|------|
| .scene-bg | img タイル + CSS アニメーション | 横スクロール |
| .scene-floor | img | translateY(16%) |
| .scene-character | img | left 70%, bottom 8%, width min(16vw, 140px) |
| .command-panel | aside | TOP のみ表示 |
| .jump-bar | nav | 詳細時のみ表示 |
| .detail-panel | section | 詳細オーバーレイ |

### 状態管理（main_script.js）

    let currentScreen = 'top';
    const VALID_SCREENS = ['top', 'about', 'skills', 'works', 'contact'];

    function showScreen(name) {
      // body.is-detail-open の ON/OFF
      // .jump-bar / .detail-panel の is-hidden 切替
      // .detail-content の data-content で表示切替
      // Contact 時 loadGitHubRepos()（1 回だけ）
    }

### 表示ルール

| 要素 | top | about 等 |
|------|-----|----------|
| 背景 | 表示 | 表示 |
| キャラ + 床 | 表示（中央寄り） | キャラは右下に小さく残す |
| コマンドパネル | 表示 | 非表示 |
| ジャンプバー | 非表示 | 表示 |
| 詳細パネル | 非表示 | 表示 |
| 戻るボタン | 非表示 | 表示 |

---

## レスポンシブ（main_style.css）

| ブレークポイント | 主な調整 |
|------------------|----------|
| デフォルト（1201px〜） | ワイド PC。キャラ left 70%, bottom 8% |
| max-width: 1200px | キャラ left 60%, bottom 5%。床 translateY(14%) |
| max-width: 768px | コマンド縮小、キャラ中央寄せ bottom 4% |
| max-width: 480px | スマホ向けさらに縮小 |

---

## データ設計（コンテンツ）

正本: index.html 内のテキスト。

| 画面 | 掲載内容 |
|------|----------|
| About | intro + MORE（自分について / Biography / 強み 3 つ） |
| Skills | C++, DXLib, 3D, Tools + ツール使用歴 |
| Works | シロのマジックトレーニング / 2Dアクション / 3Dシューティング |
| Contact | メール taka.yuuki02@gmail.com + GitHub プロフィール + API リポジトリ一覧 |

公開前に必ず差し替え・確認:
- OGP URL → GitHub Pages の実公開 URL
- meta description（未設定なら追加）

---

## 画像アセット

| 用途 | ファイル名 | パス | 状態 |
|------|-----------|------|------|
| 背景 | bg.png | assets/images/bg.png | 配置済み・使用中 |
| 床 | floor.png | assets/images/floor.png | 配置済み・使用中 |
| キャラ | character.png | assets/images/character.png | 配置済み・使用中 |

---

## 次にやること（優先順）

### Step 1: Phase 5 仕上げ（任意・短時間）

1. DevTools で幅 375px を確認（TOP + 各詳細）
2. フル画面 PC と 1200px の両方でキャラ位置を確認

### Step 2: Phase 6 GitHub Pages 公開

1. GitHub リポジトリ Settings → Pages → Source を branch / root に設定
2. 数分待って公開 URL を確認
3. meta / OGP の URL を公開 URL に差し替え
4. スマホ実機で最終確認

### Step 3: 任意の拡張（Phase 7）

- Works スクショ・動画リンク
- キャラ待機アニメーション
- prefers-reduced-motion

---

## 困っていること・メモ

- [i] HandMade_Takahashi_PortfolioSite/PortfolioSite/ とリポジトリ直下でファイルが二重。正本は直下。
- [i] GitHub Pages 公開時、ルートをリポジトリ直下のままにする想定（`/docs` フォルダは使わない）。
- [i] Contact の GitHub API は空リポジトリ時 `reposLoaded` が true にならない（再表示で再取得）。
- [i] CSS コメントと数値が不一致の箇所あり（任意で修正可）。

---

## Phase 完了チェック

| Phase | 完了日 | メモ |
|-------|--------|------|
| 0 | 2026-06-15 | |
| 1 | 2026-06〜07 | meta/OGP 残 |
| 2 | 2026-06〜07 | |
| 3 | 2026-06〜07 | |
| 4 | 2026-06〜07 | |
| 4.5 | 2026-07 | GitHub API |
| 5 | | 1200px 含む。375px 確認残 |
| 6 | | **次** |

---

## 別エージェントへの依頼文（コピペ用）

docs/HANDOFF.md と docs/ROADMAP.md を読んでから作業してください。
メインは Takahashi_Portfolio_WebSite_260615/ リポジトリ直下です。
Phase 0〜4.5 は完了。Phase 5 はほぼ完了（1200 / 768 / 480）。次は Phase 6（GitHub Pages 公開）。

- index.html + css/main_style.css + js/main_script.js で全画面動作済み
- showScreen() / loadGitHubRepos() 実装済み
- VALID_SCREENS: top, about, skills, works, contact（timeline なし）
- 画像: assets/images/bg.png, floor.png, character.png
- HandMade_Takahashi_PortfolioSite/ は旧フォルダ。直下が正本

---

## 触った・参照するファイル（主要）

### 本番（リポジトリ直下）
- index.html
- css/main_style.css
- js/main_script.js
- assets/images/bg.png
- assets/images/floor.png
- assets/images/character.png

### ドキュメント
- docs/HANDOFF.md
- docs/ROADMAP.md

### 参考
- AIMade_Takahashi_PortfolioSite/takahashi_portfolio_site/index.html
- AIMade_Takahashi_PortfolioSite/takahashi_portfolio_site/style.css
- AIMade_Takahashi_PortfolioSite/takahashi_portfolio_site/script.js

### 重複注意
- HandMade_Takahashi_PortfolioSite/PortfolioSite/（同名画像・空 CSS/JS）