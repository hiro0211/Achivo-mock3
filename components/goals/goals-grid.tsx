"use client";

import { useState, useEffect } from "react";
import { GoalCard } from "./goal-card";
import { GoalData } from "@/types/goal-data";
import {
  getUserGoals,
  checkUserHasGoals,
} from "@/lib/supabase/goal-data-service";
import { useUser } from "@/lib/auth-utils";

export function GoalsGrid() {
  const { user, loading: userLoading } = useUser();
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasGoals, setHasGoals] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?.id) {
        console.log("ユーザーIDが取得できていません");
        setLoading(false);
        return;
      }
      console.log("認証されたユーザー情報:", {
        userId: user.id,
      });

      try {
        console.log("Goals取得処理開始 - ユーザーID:", user.id);

        // まず目標データが存在するかチェック
        const goalsExist = await checkUserHasGoals(user.id);
        console.log("目標データ存在チェック結果:", goalsExist);
        setHasGoals(goalsExist);

        if (goalsExist) {
          console.log("目標データが存在するため取得処理を開始");
          // 目標データが存在する場合は取得
          const data = await getUserGoals(user.id);
          console.log("取得した目標データ:", data);
          setGoalData(data);
        } else {
          console.log("目標データが存在しないためデフォルトメッセージを設定");
          // 目標データが存在しない場合はデフォルトメッセージ
          setGoalData({
            idealFuture:
              "チャットで目標設定を行うと、ここに理想のライフスタイルが表示されます。",
            quarterGoal:
              "チャットで目標設定を行うと、ここに3ヶ月目標が表示されます。",
            oneMonthGoal:
              "チャットで目標設定を行うと、ここに1ヶ月目標が表示されます。",
            oneWeekGoal:
              "チャットで目標設定を行うと、ここに1週間目標が表示されます。",
            limitRules:
              "チャットで目標設定を行うと、ここに制限ルールが表示されます。",
            dailyTasks:
              "チャットで目標設定を行うと、ここに日次タスクが表示されます。",
          });
        }
      } catch (error) {
        console.error("目標データの取得に失敗:", error);
        setGoalData({
          idealFuture: "目標データの取得中にエラーが発生しました。",
          quarterGoal: "目標データの取得中にエラーが発生しました。",
          oneMonthGoal: "目標データの取得中にエラーが発生しました。",
          oneWeekGoal: "目標データの取得中にエラーが発生しました。",
          limitRules: "目標データの取得中にエラーが発生しました。",
          dailyTasks: "目標データの取得中にエラーが発生しました。",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchGoals();
    }
  }, [user?.id, userLoading]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">目標データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ログインが必要です。</p>
        </div>
      </div>
    );
  }

  if (!goalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">目標データの読み込みに失敗しました。</p>
        </div>
      </div>
    );
  }

  return <GoalCard goalData={goalData} hasGoals={hasGoals} />;
}
