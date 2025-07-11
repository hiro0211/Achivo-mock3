# Achivo - AI 目標達成ダッシュボード

## 📋 プロジェクト概要

Achivo は AI を活用して目標達成をサポートするダッシュボードアプリケーションです。ユーザーは理想のライフスタイルを入力し、AI が自動的に目標とタスクを生成・管理します。

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: Radix UI
- **データベース・認証**: Supabase
- **AI 機能**: Dify API
- **状態管理**: React Hooks
- **フォーム管理**: React Hook Form + Zod

## 📁 プロジェクト構造

### 🗂️ ルートディレクトリ

```
Achivo-mock3/
├── app/                    # Next.js App Router のメインディレクトリ
├── components/             # 再利用可能なコンポーネント
├── constants/              # 定数・設定ファイル
├── hooks/                  # カスタムフック
├── lib/                    # ライブラリ・ユーティリティ
├── types/                  # TypeScript 型定義
├── middleware.ts           # Next.js ミドルウェア（認証）
├── next.config.js          # Next.js 設定
├── package.json            # 依存関係・スクリプト
├── tailwind.config.ts      # Tailwind CSS 設定
├── tsconfig.json           # TypeScript 設定
└── vercel.json             # Vercel デプロイ設定
```

---

## 📂 詳細なフォルダー・ファイル構造

### 🔹 `/app` - Next.js App Router

Next.js の App Router を使用したページと API 定義

```
app/
├── layout.tsx              # ルートレイアウト（共通UI・プロバイダー）
├── page.tsx                # ホームページ（ダッシュボードにリダイレクト）
├── globals.css             # グローバルスタイル
├── components/
│   └── SupabaseProvider.tsx # Supabase認証プロバイダー
├── api/                    # API Routes
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts    # OAuth認証コールバック
│   │   └── logout/
│   │       └── route.ts    # ログアウト処理
│   ├── goal-chat/
│   │   └── route.ts        # AI目標チャット API
│   └── health/
│       └── route.ts        # ヘルスチェック API
├── dashboard/
│   └── page.tsx            # ダッシュボードページ（メイン画面）
├── goals/
│   └── page.tsx            # 目標一覧ページ
├── tasks/
│   └── page.tsx            # タスク一覧ページ
├── progress/
│   └── page.tsx            # 進捗確認ページ
├── login/
│   ├── page.tsx            # ログインページ
│   └── components/
│       └── LoginForm.tsx   # ログインフォーム
├── signup/
│   ├── page.tsx            # サインアップページ
│   └── components/
│       └── SignupForm.tsx  # サインアップフォーム
└── verification/
    └── page.tsx            # メール認証ページ
```

### 🔹 `/components` - 再利用可能コンポーネント

機能別に分類された React コンポーネント

```
components/
├── dashboard/              # ダッシュボード関連
│   ├── goal-chat-interface.tsx  # AI目標チャット画面
│   ├── chat-input.tsx           # チャット入力フォーム
│   ├── chat-message.tsx         # チャットメッセージ表示
│   ├── chat-panel.tsx           # チャットパネル
│   ├── summary-card.tsx         # サマリーカード
│   └── summary-stack.tsx        # サマリースタック
├── goals/                  # 目標関連
│   ├── goal-card.tsx       # 目標カード
│   └── goals-grid.tsx      # 目標グリッド表示
├── tasks/                  # タスク関連
│   ├── task-item.tsx       # タスクアイテム
│   └── task-list.tsx       # タスクリスト
├── progress/               # 進捗関連
│   ├── kpi-card.tsx        # KPI カード
│   ├── kpi-grid.tsx        # KPI グリッド
│   ├── progress-chart.tsx  # 進捗チャート
│   └── progress-ring.tsx   # 進捗リング
├── layout/                 # レイアウト関連
│   ├── header.tsx          # ヘッダー
│   ├── sidebar.tsx         # サイドバー
│   └── theme-toggle.tsx    # テーマ切り替え
├── providers/              # プロバイダー
│   └── theme-provider.tsx  # テーマプロバイダー
└── ui/                     # 基本UIコンポーネント
    ├── avatar.tsx          # アバター
    ├── badge.tsx           # バッジ
    ├── button.tsx          # ボタン
    ├── calendar.tsx        # カレンダー
    ├── card.tsx            # カード
    ├── chart.tsx           # チャート
    ├── checkbox.tsx        # チェックボックス
    ├── input.tsx           # インプット
    ├── label.tsx           # ラベル
    ├── progress.tsx        # プログレスバー
    ├── scroll-area.tsx     # スクロールエリア
    ├── select.tsx          # セレクト
    ├── separator.tsx       # セパレーター
    ├── textarea.tsx        # テキストエリア
    ├── toast.tsx           # トースト
    └── toaster.tsx         # トースター
```

### 🔹 `/constants` - 定数・設定

```
constants/
├── navigation.ts           # ナビゲーション定義
└── mock-data.ts           # モックデータ
```

### 🔹 `/hooks` - カスタムフック

```
hooks/
├── use-goals.ts           # 目標管理フック
├── use-tasks.ts           # タスク管理フック
├── use-theme.ts           # テーマ管理フック
└── use-toast.ts           # トースト管理フック
```

### 🔹 `/lib` - ライブラリ・ユーティリティ

```
lib/
├── api/
│   └── notification.ts     # 通知API
├── auth-utils.tsx          # 認証ユーティリティ
├── supabase-server.ts      # Supabaseサーバークライアント
├── utils.ts                # 汎用ユーティリティ
├── hooks/
│   └── use-auth.ts         # 認証フック
├── interfaces/             # インターフェース定義
├── repositories/           # データアクセス層
│   ├── goal-repository.ts      # 目標データアクセス
│   ├── goal-server-repository.ts # 目標サーバーデータアクセス
│   └── task-repository.ts      # タスクデータアクセス
├── services/               # サービス層
│   ├── dify-service.ts     # Dify AI サービス
│   └── goal-service.ts     # 目標サービス
├── supabase/
│   └── browser-client.ts   # Supabaseブラウザクライアント
└── utils/
    ├── error-handler.ts    # エラーハンドリング
    └── url.ts              # URL ユーティリティ
```

### 🔹 `/types` - TypeScript 型定義

```
types/
├── index.ts                # 基本型定義
│   ├── User                # ユーザー型
│   ├── Goal                # 目標型
│   ├── Task                # タスク型
│   ├── Message             # メッセージ型
│   ├── ProgressData        # 進捗データ型
│   ├── KPI                 # KPI型
│   ├── NavItem             # ナビゲーションアイテム型
│   ├── DifyInput           # Dify入力型
│   └── SummaryCard         # サマリーカード型
└── goal-data.ts            # 目標データ型
```

---

## 🔧 設定ファイル

### 🔹 認証・セキュリティ

| ファイル                         | 役割                                 |
| -------------------------------- | ------------------------------------ |
| `middleware.ts`                  | 認証ミドルウェア・ページアクセス制御 |
| `lib/supabase/browser-client.ts` | Supabase クライアント設定            |
| `lib/supabase-server.ts`         | Supabase サーバー設定                |

### 🔹 開発・ビルド設定

| ファイル             | 役割              |
| -------------------- | ----------------- |
| `next.config.js`     | Next.js 設定      |
| `tailwind.config.ts` | Tailwind CSS 設定 |
| `tsconfig.json`      | TypeScript 設定   |
| `postcss.config.js`  | PostCSS 設定      |
| `components.json`    | Radix UI 設定     |

### 🔹 デプロイ・環境設定

| ファイル           | 役割                     |
| ------------------ | ------------------------ |
| `vercel.json`      | Vercel デプロイ設定      |
| `sample.env.local` | 環境変数サンプル         |
| `package.json`     | 依存関係・スクリプト定義 |

---

## 🚀 主要機能

### 1. **AI 目標設定チャット**

- **場所**: `components/dashboard/goal-chat-interface.tsx`
- **機能**: ユーザーの理想を聞いて目標を自動生成
- **AI**: Dify API 連携

### 2. **認証システム**

- **場所**: `app/login/`, `app/signup/`
- **機能**: Supabase 認証（OAuth 対応）
- **保護**: ミドルウェアによるページアクセス制御

### 3. **目標・タスク管理**

- **場所**: `app/goals/`, `app/tasks/`
- **機能**: CRUD 操作、進捗追跡
- **データ**: Supabase データベース

### 4. **進捗可視化**

- **場所**: `app/progress/`
- **機能**: チャート・KPI 表示
- **ライブラリ**: Recharts

---

## 🔌 外部サービス連携

### **Supabase**

- **認証**: OAuth、メール認証
- **データベース**: PostgreSQL
- **設定**: `lib/supabase/`

### **Dify AI**

- **機能**: 自然言語処理、目標生成
- **設定**: `lib/services/dify-service.ts`
- **API**: REST API

---

## 📦 依存関係

### **主要依存関係**

```json
{
  "next": "^15.3.1",
  "react": "18.2.0",
  "typescript": "5.2.2",
  "@supabase/supabase-js": "^2.49.4",
  "@radix-ui/react-*": "最新版",
  "tailwindcss": "3.3.3",
  "recharts": "^2.12.7"
}
```

### **開発依存関係**

- TypeScript 型定義
- ESLint 設定
- Tailwind CSS

---

## 🎨 UI コンポーネント

**Radix UI**ベースのコンポーネントライブラリを使用：

- アクセシビリティ対応
- テーマ切り替え対応
- レスポンシブデザイン

---

## 🔒 セキュリティ

1. **認証**: Supabase 認証
2. **アクセス制御**: Next.js Middleware
3. **データ保護**: Row Level Security (RLS)
4. **API 保護**: サーバーサイド検証

---

## 🚀 開発開始

```bash
# 依存関係インストール
npm install

# 環境変数設定
cp sample.env.local .env.local

# 開発サーバー起動
npm run dev
```

---

## 📝 開発メモ

- **App Router**: Next.js 15 の新しいルーティング
- **TypeScript**: 型安全な開発
- **コンポーネント**: 再利用可能な設計
- **状態管理**: React Hooks ベース
- **スタイリング**: Tailwind CSS + Radix UI
