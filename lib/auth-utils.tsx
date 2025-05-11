"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/components/SupabaseProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GoalChatInterface } from "@/components/chat/goal-chat-interface";

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("ユーザー情報の取得中にエラーが発生しました:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // セッション変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user?: { id: string } } | null) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

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
