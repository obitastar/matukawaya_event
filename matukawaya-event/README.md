# 御福まつかわや 着物展示会LP

老舗呉服店「御福まつかわや」の着物展示会ランディングページです。

- **開催日**: 2026年5月30日(土)・31日(日)
- **会場**: 大阪国際交流センター 鴻臚庵
- **構成**: 単体HTML + CSS + JS のシンプル構成（フレームワーク不使用）

---

## ファイル構成

```
matukawaya-event/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── img/          (画像ファイル)
│   └── favicon/
└── README.md
```

---

## ローカル動作確認方法

任意のローカルサーバーで `index.html` を開いてください。

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# VS Code
# 拡張機能「Live Server」をインストールし、index.html を右クリック → Open with Live Server
```

---

## 画像差し替え手順

`assets/img/` 内の以下のファイルをそれぞれ差し替えてください。ファイル名はそのまま維持すること。

| ファイル名 | 用途 | 推奨サイズ | 備考 |
|---|---|---|---|
| `fv.jpg` | FV背景画像 | 1920x1080以上 | 薄暗い背景に反物がドラマチックに浮かぶ写真 |
| `nishihara-main.jpg` | 西原染匠メイン写真 | 800x1200 | 手描き友禅の訪問着・名古屋帯 |
| `nishihara-process-01.jpg` ~ `06.jpg` | 工程写真 | 400x560 | 糸目糊置き、彩色、地染め、蒸し、金加工、仕上げ |
| `chikusen-main.jpg` | 竺仙メイン写真 | 800x1200 | 江戸染浴衣 |
| `chikusen-detail-01.jpg` ~ `04.jpg` | 柄ディテール | 600x600 | 藍の濃淡、染めの粒子感 |
| `matukawaya-portrait.jpg` | 八代目当主写真 | 600x800 | 任意（なければ省略可） |
| `kohroan.jpg` | 茶室写真 | 1920x1080 | 鴻臚庵の内観 |
| `og-image.jpg` | OGP用画像 | 1200x630 | SNSシェア時に表示 |
| `favicon/favicon.ico` | ファビコン | 32x32 | 最終ロゴに差し替え |
| `favicon/apple-touch-icon.png` | Apple Touch Icon | 180x180 | 最終ロゴに差し替え |

---

## 計測タグの差し替え手順

`index.html` の `<head>` 内にコメントアウトされた計測タグのプレースホルダーがあります。

### GA4

`G-XXXXXXXXXX` を実際の測定IDに差し替え、コメントアウトを解除してください。

### Meta Pixel

プレースホルダーを実際のPixelコードに差し替えてください。

### Google Tag Manager

必要に応じて追加してください。

---

## フォーム送信先の最終決定

現在 `action="mailto:order@matukawaya.com"` を仮設定しています。

最終的な送信先を以下から選定し、差し替えが必要です。

- Formrun
- Google フォーム埋め込み
- 独自エンドポイント
- その他フォームサービス

**該当箇所**: `index.html` 内の `<form class="reservation-form">`

---

## プライバシーポリシーURL

現在 `href="#privacy-policy"` をプレースホルダーとして設定しています。

正式なプライバシーポリシーページのURLに差し替えてください。

**該当箇所**: `index.html` 内のフォームセクション

---

## SNS各種URLの差し替え

フッターのSNSリンクはプレースホルダーです。

公式サイト https://www.matukawaya.com/ のトップページからリンクを取得し、以下を差し替えてください。

- Instagram
- LINE
- YouTube
- Facebook

---

## 公開時のドメイン置き換え箇所

以下のURLが `https://example.com/` で仮設定されています。公開ドメイン確定後に差し替えてください。

- OGP関連: `og:url`, `og:image`, `twitter:image`
- 構造化データ内のURL（必要に応じて）

---

## 技術仕様メモ

- モバイルファースト設計
- Google Fonts: Shippori Mincho, Noto Sans JP, Cormorant Garamond
- Vanilla JS（フレームワーク不使用）
- IE11非対応
