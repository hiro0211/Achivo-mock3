"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/app/components/SupabaseProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GoalChatInterface } from "@/components/dashboard/goal-chat-interface";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 初期セッション取得
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("初期セッション取得エラー:", error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // 認証状態変更の監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}

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

// GoalChatInterfaceWrapper - 認証が必要なコンポーネント用
export function useUserId() {
  const { user, loading } = useAuth();
  return {
    userId: user?.id ?? null,
    loading,
  };
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
