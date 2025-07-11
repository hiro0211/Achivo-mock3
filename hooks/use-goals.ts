import { useState, useEffect } from "react";
import { GoalData } from "@/types/goal-data";
import {
  getUserGoals,
  checkUserHasGoals,
} from "@/lib/repositories/goal-repository";
import { useUser } from "@/lib/auth-utils";

interface UseGoalsReturn {
  goalData: GoalData | null;
  loading: boolean;
  error: string | null;
  hasGoals: boolean;
  reloadGoals: () => Promise<void>;
}

const DEFAULT_GOAL_MESSAGES: GoalData = {
  idealFuture:
    "チャットで目標設定を行うと、ここに理想のライフスタイルが表示されます。",
  quarterGoal: "チャットで目標設定を行うと、ここに3ヶ月目標が表示されます。",
  oneMonthGoal: "チャットで目標設定を行うと、ここに1ヶ月目標が表示されます。",
  oneWeekGoal: "チャットで目標設定を行うと、ここに1週間目標が表示されます。",
  limitRules: "チャットで目標設定を行うと、ここに制限ルールが表示されます。",
  dailyTasks: "チャットで目標設定を行うと、ここに日次タスクが表示されます。",
};

const ERROR_GOAL_MESSAGES: GoalData = {
  idealFuture: "目標データの取得中にエラーが発生しました。",
  quarterGoal: "目標データの取得中にエラーが発生しました。",
  oneMonthGoal: "目標データの取得中にエラーが発生しました。",
  oneWeekGoal: "目標データの取得中にエラーが発生しました。",
  limitRules: "目標データの取得中にエラーが発生しました。",
  dailyTasks: "目標データの取得中にエラーが発生しました。",
};

export function useGoals(): UseGoalsReturn {
  const { user, loading: userLoading } = useUser();
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasGoals, setHasGoals] = useState(false);

  const fetchGoals = async () => {
    if (!user?.id || userLoading) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 目標データ存在チェック
      const goalsExist = await checkUserHasGoals(user.id);
      setHasGoals(goalsExist);

      if (goalsExist) {
        // 目標データを取得
        const data = await getUserGoals(user.id);
        setGoalData(data);
      } else {
        // デフォルトメッセージを設定
        setGoalData(DEFAULT_GOAL_MESSAGES);
      }
    } catch (err) {
      setError("目標データの取得に失敗しました");
      setGoalData(ERROR_GOAL_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      fetchGoals();
    }
  }, [user?.id, userLoading]);

  const reloadGoals = async () => {
    await fetchGoals();
  };

  return {
    goalData,
    loading,
    error,
    hasGoals,
    reloadGoals,
  };
}
