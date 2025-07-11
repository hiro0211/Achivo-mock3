import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  // middleware実行ログは開発環境でのみ出力

  // パブリックパス (認証が不要なパス)
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verification" ||
    path === "/api/auth/callback" ||
    path === "/";

  // APIルートやコールバックパスの場合は処理をスキップ
  if (path.startsWith("/api/")) {
    // APIルートログは開発環境でのみ出力
    return res;
  }

  try {
    // Supabaseクライアントを作成
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name) {
            return req.cookies.get(name)?.value;
          },
          set(name, value, options) {
            req.cookies.set({
              name,
              value,
              ...options,
            });
            res.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            req.cookies.set(name, "");
            res.cookies.set(name, "");
          },
        },
      }
    );

    // タイムアウト付きでセッション情報を取得
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Session timeout")), 5000)
    );

    const result = await Promise.race([sessionPromise, timeoutPromise]);
    const { data } = result as { data: { session: any } };
    const session = data?.session;

    // 開発環境でのみ認証状態をログ出力

    // 認証済みユーザーがログイン/サインアップページにアクセスした場合はダッシュボードにリダイレクト
    if (isPublicPath && session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 未認証ユーザーが保護されたルートにアクセスした場合はログインページにリダイレクト
    if (!isPublicPath && !session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  } catch (error) {
    // エラーは開発環境でのみログ出力
    if (process.env.NODE_ENV === "development") {
      console.error("ミドルウェアエラー:", error);
    }

    // タイムアウトエラーの場合は、セッション無しとして処理を続行
    if (error instanceof Error && error.message === "Session timeout") {
      if (!isPublicPath) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return res;
    }

    // エラーが発生した場合で保護されたページにアクセスしようとしている場合はログインページへリダイレクト
    if (!isPublicPath) {
      return NextResponse.redirect(
        new URL("/login?error=auth_middleware", req.url)
      );
    }

    // パブリックページの場合はそのまま表示
    return res;
  }
}

// ミドルウェアを適用するパス
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verification",
    "/dashboard",
    "/dashboard/:path*",
    "/goals",
    "/goals/:path*",
    "/tasks",
    "/tasks/:path*",
    "/progress",
    "/progress/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
