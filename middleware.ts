import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  console.log("Middleware実行:", path);

  // パブリックパス (認証が不要なパス)
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verification" ||
    path === "/api/auth/callback" ||
    path === "/";

  // APIルートやコールバックパスの場合は処理をスキップ
  if (path.startsWith("/api/")) {
    console.log("APIルートなのでスキップ:", path);
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

    const { data } = (await Promise.race([
      sessionPromise,
      timeoutPromise,
    ])) as any;
    const session = data?.session;

    console.log("認証状態:", session ? "認証済み" : "未認証");

    // 認証済みユーザーがログイン/サインアップページにアクセスした場合はダッシュボードにリダイレクト
    if (isPublicPath && session) {
      console.log(
        "認証済みユーザーがパブリックページにアクセス - ダッシュボードへリダイレクト"
      );
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 未認証ユーザーが保護されたルートにアクセスした場合はログインページにリダイレクト
    if (!isPublicPath && !session) {
      console.log(
        "未認証ユーザーが保護ページにアクセス - ログインへリダイレクト"
      );
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("通常のページアクセス - そのまま表示");
    return res;
  } catch (error) {
    console.error("ミドルウェアエラー:", error);

    // タイムアウトエラーの場合は、セッション無しとして処理を続行
    if (error instanceof Error && error.message === "Session timeout") {
      console.log("セッション取得タイムアウト - 未認証として処理");
      if (!isPublicPath) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return res;
    }

    // エラーが発生した場合で保護されたページにアクセスしようとしている場合はログインページへリダイレクト
    if (!isPublicPath) {
      console.log("エラー発生時の保護ページアクセス - ログインへリダイレクト");
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
