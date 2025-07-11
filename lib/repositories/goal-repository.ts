import { GoalData } from "@/types/goal-data";
import { executeWithRetry } from "../utils/error-handler";

// データベーステーブルの型定義
interface LifestyleData {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
}

interface GoalDescriptionData {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
}

interface RestrictRuleData {
  id: string;
  user_id: string;
  created_at: string;
}

interface RestrictRuleItem {
  text: string;
}

interface TodoData {
  title: string;
}

/**
 * クライアントサイド専用の目標データリポジトリ
 */
export class GoalRepository {
  /**
   * ユーザーの目標データを取得（クライアントサイド用）
   */
  async getUserGoals(userId: string): Promise<GoalData | null> {
    // クライアントサイドでのみ動的インポート
    const { getBrowserSupabaseClient } = await import(
      "../supabase/browser-client"
    );

    try {
      const browserSupabase = getBrowserSupabaseClient();

      // 1. 理想のライフスタイルを取得
      const { data: idealLifestyle, error: idealError } =
        await executeWithRetry<LifestyleData>(
          async () =>
            await browserSupabase
              .from("IDEAL_LIFESTYLES")
              .select("*")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1)
              .single(),
          "理想のライフスタイル取得"
        );

      if (idealError && idealError.code !== "PGRST116") {
        return null;
      }

      // 2. 3ヶ月目標を取得
      const { data: quarterGoal, error: quarterError } =
        await executeWithRetry<GoalDescriptionData>(
          async () =>
            await browserSupabase
              .from("QUARTER_GOALS")
              .select("*")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1)
              .single(),
          "3ヶ月目標取得"
        );

      if (quarterError && quarterError.code !== "PGRST116") {
        return null;
      }

      // 3. 1ヶ月目標を取得
      const { data: monthlyGoal, error: monthlyError } =
        await executeWithRetry<GoalDescriptionData>(
          async () =>
            await browserSupabase
              .from("MONTHLY_GOALS")
              .select("*")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1)
              .single(),
          "1ヶ月目標取得"
        );

      // 4. 1週間目標を取得
      const { data: weeklyGoal, error: weeklyError } =
        await executeWithRetry<GoalDescriptionData>(
          async () =>
            await browserSupabase
              .from("WEEKLY_GOALS")
              .select("*")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1)
              .single(),
          "1週間目標取得"
        );

      // 5. 制限ルールを取得
      const { data: restrictRule, error: restrictError } =
        await executeWithRetry<RestrictRuleData>(
          async () =>
            await browserSupabase
              .from("Restrict_Rule")
              .select("id")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1)
              .single(),
          "制限ルール取得"
        );

      let limitRulesText = "";
      if (restrictRule && !restrictError) {
        const { data: restrictItems, error: itemsError } =
          await executeWithRetry<RestrictRuleItem[]>(
            async () =>
              await browserSupabase
                .from("RESTRICT_RULE_ITEMS")
                .select("text")
                .eq("restrict_rule_id", restrictRule.id),
            "制限ルール項目取得"
          );

        if (!itemsError && restrictItems && Array.isArray(restrictItems)) {
          limitRulesText = restrictItems
            .map((item: RestrictRuleItem) => `・${item.text}`)
            .join("\n");
        }
      }

      // 6. 日次タスクを取得
      const { data: todos, error: todosError } = await executeWithRetry<
        TodoData[]
      >(
        async () =>
          await browserSupabase
            .from("TODOS")
            .select("title")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
        "日次タスク取得"
      );

      let dailyTasksText = "";
      if (!todosError && todos && Array.isArray(todos)) {
        dailyTasksText = todos
          .map((todo: TodoData) => `○ ${todo.title}`)
          .join("\n");
      }

      // GoalDataインターフェースに合わせて整形
      const goalData: GoalData = {
        idealFuture:
          idealLifestyle?.description ||
          "理想のライフスタイルが設定されていません",
        quarterGoal:
          quarterGoal?.description || "3ヶ月目標が設定されていません",
        oneMonthGoal:
          monthlyGoal?.description || "1ヶ月目標が設定されていません",
        oneWeekGoal: weeklyGoal?.description || "1週間目標が設定されていません",
        limitRules: limitRulesText || "制限ルールが設定されていません",
        dailyTasks: dailyTasksText || "日次タスクが設定されていません",
      };

      return goalData;
    } catch (error) {
      return null;
    }
  }

  /**
   * 目標データが存在するかチェック（クライアントサイド用）
   */
  async checkUserHasGoals(userId: string): Promise<boolean> {
    // クライアントサイドでのみ動的インポート
    const { getBrowserSupabaseClient } = await import(
      "../supabase/browser-client"
    );

    try {
      const browserSupabase = getBrowserSupabaseClient();

      const { data, error } = await executeWithRetry<LifestyleData>(
        async () =>
          await browserSupabase
            .from("IDEAL_LIFESTYLES")
            .select("id, user_id, description")
            .eq("user_id", userId)
            .limit(1)
            .single(),
        "目標存在チェック"
      );

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}

export const goalRepository = new GoalRepository();

// 後方互換性のための関数エクスポート
export async function getUserGoals(userId: string): Promise<GoalData | null> {
  return goalRepository.getUserGoals(userId);
}

export async function checkUserHasGoals(userId: string): Promise<boolean> {
  return goalRepository.checkUserHasGoals(userId);
}
