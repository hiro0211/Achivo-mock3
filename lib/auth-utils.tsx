"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/components/SupabaseProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GoalChatInterface } from "@/components/dashboard/goal-chat-interface";
import type { User } from "@supabase/supabase-js";

// クライアントサイドでログアウトするためのフック
export function useLogout() {
  const router = useRouter();
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}

// ユーザー情報を取得するためのフック
export function useUser() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // 最初にセッションを確認
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("セッション取得エラー:", error);
        }

        if (isMounted) {
          setUser(session?.user || null);
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error("認証初期化エラー:", error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("認証状態変更:", { event, hasSession: !!session });

      if (isMounted) {
        setUser(session?.user || null);

        // 初期化が完了していない場合は完了させる
        if (!initialized) {
          setLoading(false);
          setInitialized(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, initialized]);

  return { user, loading };
}

export function GoalChatInterfaceWrapper() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return <GoalChatInterface userId={userId} />;
}
