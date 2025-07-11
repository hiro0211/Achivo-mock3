"use client";

import { GoalCard } from "./goal-card";
import { useGoals } from "@/hooks/use-goals";
import { useUser } from "@/lib/auth-utils";

export function GoalsGrid() {
  const { user, loading: userLoading } = useUser();
  const { goalData, loading, hasGoals } = useGoals();

  if (userLoading || loading) {
    return <GoalsLoadingSkeleton />;
  }

  if (!user) {
    return <GoalsAuthError />;
  }

  if (!goalData) {
    return <GoalsDataError />;
  }

  return <GoalCard goalData={goalData} hasGoals={hasGoals} />;
}

// ローディング状態のコンポーネント
function GoalsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">目標データを読み込み中...</p>
      </div>
    </div>
  );
}

// 認証エラーコンポーネント
function GoalsAuthError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">ログインが必要です。</p>
      </div>
    </div>
  );
}

// データエラーコンポーネント
function GoalsDataError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">目標データの読み込みに失敗しました。</p>
      </div>
    </div>
  );
}
