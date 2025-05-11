import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GoalChatInterface } from "@/components/dashboard/goal-chat-interface";

export const metadata: Metadata = {
  title: "ダッシュボード | Achivo",
  description: "あなたの目標とタスクを管理するダッシュボード",
};

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalChatInterface userId={userId} />
        <div className="space-y-6">
          {/* 将来的にここに目標リストやタスクリストを追加 */}
        </div>
      </div>
    </div>
  );
}
