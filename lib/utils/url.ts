/**
 * 環境に応じて適切なベースURLを取得する
 */
export function getBaseUrl(): string {
  // サーバーサイドの場合
  if (typeof window === "undefined") {
    // 環境変数で明示的に設定されたURL
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
    // Vercel環境の場合（自動設定）
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    // 本番環境の場合（カスタムドメイン）
    if (process.env.NODE_ENV === "production") {
      // TODO: 実際のドメインに置き換えてください
      return "https://your-app-domain.vercel.app";
    }
    // 開発環境の場合
    return "http://localhost:3000";
  }

  // クライアントサイドの場合
  return window.location.origin;
}

/**
 * API呼び出し用のベースURLを取得する
 */
export function getApiBaseUrl(): string {
  return getBaseUrl();
}
