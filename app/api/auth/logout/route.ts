import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
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
            try {
              const cookieStore = await cookies();
              cookieStore.set(name, value, options);
            } catch (error) {
              console.error('Cookie設定エラー:', error);
            }
          },
          async remove(name, options) {
            try {
              const cookieStore = await cookies();
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            } catch (error) {
              console.error('Cookie削除エラー:', error);
            }
          },
        },
      }
    );

    // ユーザーをログアウト
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error("ログアウトエラー:", error);
    // エラーが発生した場合もログインページにリダイレクト
    return NextResponse.redirect(new URL('/login', request.url));
  }
} 