import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

/**
 * クライアントサイド用のSupabaseクライアントを取得
 * シングルトンパターンで実装し、一度作成したクライアントを再利用
 */
export function getBrowserSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          "X-Client-Info": "browser-client",
        },
      },
    }
  );

  supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("認証状態変更:", { event, sessionExists: !!session });

    if (event === "TOKEN_REFRESHED") {
      console.log("JWTトークンが更新されました");
    }

    if (event === "SIGNED_OUT") {
      console.log("ユーザーがサインアウトしました");
      supabaseClient = null;
    }
  });

  return supabaseClient;
}

/**
 * 手動でトークンをリフレッシュ
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const client = getBrowserSupabaseClient();
    const { data, error } = await client.auth.refreshSession();

    if (error) {
      console.error("トークンリフレッシュエラー:", error);
      return false;
    }

    console.log("トークンリフレッシュ成功:", !!data.session);
    return !!data.session;
  } catch (error) {
    console.error("トークンリフレッシュ中に例外発生:", error);
    return false;
  }
}

/**
 * クライアントをリセット（テスト用など）
 */
export function resetSupabaseClient(): void {
  supabaseClient = null;
}
