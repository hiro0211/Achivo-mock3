# Achivo - 目標達成サポートアプリ

Next.js 製の目標達成・自己管理サポート Web アプリケーション。AI との対話で目標設定、進捗管理、タスク管理機能を提供します。

## 技術スタック

- **フレームワーク**: Next.js 15.3.1
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **認証・データベース**: Supabase
- **UI コンポーネント**: Radix UI
- **アイコン**: Lucide React
- **グラフ**: Recharts
- **AI**: Dify API

## 環境変数の設定

### 必要な環境変数

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Dify API
DIFY_API_KEY=your_dify_api_key
```

### Vercel デプロイ時の環境変数

Vercel にデプロイする際は、以下の環境変数を Vercel の管理画面で設定してください：

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `DIFY_API_KEY`

**注意**: `VERCEL_URL`は自動的に設定されるため、手動で設定する必要はありません。

## 開発環境のセットアップ

1. **依存関係のインストール**

```bash
npm install
```

2. **環境変数の設定**

```bash
cp sample.env.local .env.local
# .env.localファイルを編集して実際の値を設定
```

3. **開発サーバーの起動**

```bash
npm run dev
```

## ビルドとデプロイ

### ローカルビルド

```bash
npm run build
npm start
```

### Vercel デプロイ

1. **Vercel CLI でデプロイ**

```bash
npx vercel
```

2. **GitHub と連携してデプロイ**
   - GitHub リポジトリを Vercel に接続
   - 環境変数を設定
   - 自動デプロイが実行される

### デプロイ時の注意点

- **環境変数**: 本番環境用の環境変数を必ず設定してください
- **ドメイン設定**: カスタムドメインを使用する場合は、`lib/utils/url.ts`の`getBaseUrl()`関数を更新してください
- **CORS 設定**: Supabase の設定で Vercel ドメインを許可してください

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── components/        # 共通コンポーネント
│   ├── dashboard/         # ダッシュボードページ
│   ├── login/            # ログインページ
│   └── signup/           # サインアップページ
├── components/            # UIコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── dashboard/        # ダッシュボード専用コンポーネント
│   └── layout/           # レイアウトコンポーネント
├── lib/                  # ユーティリティとサービス
│   ├── services/         # 外部サービス連携
│   ├── repositories/     # データアクセス層
│   └── utils/           # ヘルパー関数
└── types/               # TypeScript型定義
```

## 主な機能

- **ユーザー認証**: Supabase Auth（メール/パスワード、Google OAuth）
- **目標設定**: AI との対話による目標設定
- **進捗管理**: 目標の進捗状況を可視化
- **タスク管理**: 日次・週次・月次タスクの管理
- **ダッシュボード**: 統合的な進捗表示

## トラブルシューティング

### localhost 接続エラー

デプロイ後に「localhost 接続拒否」エラーが発生する場合：

1. 環境変数が正しく設定されているか確認
2. Supabase の設定で Vercel ドメインが許可されているか確認
3. `lib/utils/url.ts`の`getBaseUrl()`関数が適切に設定されているか確認

### ビルドエラー

```bash
npm run build
```

でエラーが発生する場合は、TypeScript の型エラーや ESLint エラーを確認してください。
