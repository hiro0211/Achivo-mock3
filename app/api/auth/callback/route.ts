import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    console.log("認証コールバック開始: コード確認", code ? "あり" : "なし");

    if (!code) {
      console.error("認証コードがありません");
      return NextResponse.redirect(new URL('/login?error=no_code', origin));
    }

    try {
      // 新しいSSRパッケージでのクライアント作成
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
          cookies: {
            async get(name) {
              const cookieStore = await cookies();
              return cookieStore.get(name)?.value;
            },
            async set(name, value, options) {
              const cookieStore = await cookies();
              cookieStore.set(name, value, options);
            },
            async remove(name, options) {
              const cookieStore = await cookies();
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            },
          },
        }
      );

      console.log("Supabaseクライアント作成成功");

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("コード交換エラー:", error);
        return NextResponse.redirect(new URL('/login?error=auth', origin));
      }

      if (!data?.user) {
        console.error("ユーザーデータがありません");
        return NextResponse.redirect(new URL('/login?error=no_user', origin));
      }

      console.log("認証成功: ユーザー取得", data.user.id);

      try {
        // ユーザーデータをUSERSテーブルに挿入する処理
        const { data: userData, error: userError } = await supabase
          .from('USERS')
          .select('id')
          .eq('id', data.user.id)
          .single();

        console.log("ユーザーデータ確認:", userError ? "存在しない" : "既存");

        // ユーザーがUSERSテーブルに存在しない場合のみ挿入
        if (userError || !userData) {
          // ユーザーのメタデータからユーザー名を取得
          const userName = data.user.user_metadata?.name ||
            data.user.user_metadata?.full_name ||
            data.user.email?.split('@')[0] ||
            'ユーザー';

          const newUserData = {
            id: data.user.id,
            name: userName,
            email: data.user.email,
            is_active: true
          };

          console.log("USERSテーブルに挿入するデータ:", newUserData);

          const { error: insertError } = await supabase
            .from('USERS')
            .insert([newUserData]);

          if (insertError) {
            console.error("USERSテーブル挿入エラー:", insertError);
          } else {
            console.log("ユーザーデータ挿入成功");
          }
        }
      } catch (dbError) {
        console.error("データベース操作エラー:", dbError);
        // データベースエラーがあってもログイン自体は成功させる
      }

      // セッションが正しく設定されていることを確認
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        console.log("セッション確認: 正常に設定されています");
      } else {
        console.warn("セッション確認: セッションが設定されていません");
      }

      console.log("認証完了 - ダッシュボードにリダイレクト");
      // ダッシュボードへリダイレクト
      return NextResponse.redirect(new URL('/dashboard', origin));
    } catch (supabaseError) {
      console.error("Supabase操作エラー:", supabaseError);
      return NextResponse.redirect(new URL('/login?error=supabase', origin));
    }
  } catch (generalError) {
    console.error("認証コールバック一般エラー:", generalError);
    // エラーが発生した場合もログインページにリダイレクト
    return NextResponse.redirect(new URL('/login?error=general', new URL(request.url).origin));
  }
} 