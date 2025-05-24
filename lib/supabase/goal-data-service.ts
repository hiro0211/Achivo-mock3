import { GoalData } from "@/types/goal-data";
import { getBrowserSupabaseClient, refreshToken } from "./browser-client";

export interface UserGoalsData {
  idealFuture: string | null;
  quarterGoal: string | null;
  oneMonthGoal: string | null;
  oneWeekGoal: string | null;
  limitRules: string;
  dailyTasks: string;
}

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
 * トークンエラーかどうかをチェック
 */
function isTokenError(error: any): boolean {
  return (
    error?.message?.includes("JWT expired") ||
    error?.message?.includes("invalid_token") ||
    error?.code === "invalid_token" ||
    error?.status === 401
  );
}

/**
 * リトライ付きでSupabaseクエリを実行
 */
async function executeWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: any | null }>,
  description: string
): Promise<{ data: T | null; error: any | null }> {
  let result = await queryFn();

  // トークンエラーの場合、リフレッシュを試行して再実行
  if (result.error && isTokenError(result.error)) {
    console.log(
      `${description}でトークンエラーが発生、リフレッシュを試行:`,
      result.error
    );

    const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
      console.log(`トークンリフレッシュ成功、${description}を再実行`);
      result = await queryFn();
    } else {
      console.error(`トークンリフレッシュ失敗、${description}のリトライを断念`);
    }
  }

  return result;
}

export async function getUserGoals(userId: string): Promise<GoalData | null> {
  try {
    console.log("目標データ取得開始:", { userId });

    const supabase = getBrowserSupabaseClient();

    // 1. 理想のライフスタイルを取得
    const { data: idealLifestyle, error: idealError } =
      await executeWithRetry<LifestyleData>(
        async () =>
          await supabase
            .from("IDEAL_LIFESTYLES")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
        "理想のライフスタイル取得"
      );

    if (idealError && idealError.code !== "PGRST116") {
      console.error("理想のライフスタイル取得エラー:", idealError);
      return null;
    }

    // 2. 3ヶ月目標を取得
    const { data: quarterGoal, error: quarterError } =
      await executeWithRetry<GoalDescriptionData>(
        async () =>
          await supabase
            .from("QUARTER_GOALS")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
        "3ヶ月目標取得"
      );

    if (quarterError && quarterError.code !== "PGRST116") {
      console.error("3ヶ月目標取得エラー:", quarterError);
      return null;
    }

    // 3. 1ヶ月目標を取得
    const { data: monthlyGoal, error: monthlyError } =
      await executeWithRetry<GoalDescriptionData>(
        async () =>
          await supabase
            .from("MONTHLY_GOALS")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
        "1ヶ月目標取得"
      );

    if (monthlyError && monthlyError.code !== "PGRST116") {
      console.error("1ヶ月目標取得エラー:", monthlyError);
    }

    // 4. 1週間目標を取得
    const { data: weeklyGoal, error: weeklyError } =
      await executeWithRetry<GoalDescriptionData>(
        async () =>
          await supabase
            .from("WEEKLY_GOALS")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
        "1週間目標取得"
      );

    if (weeklyError && weeklyError.code !== "PGRST116") {
      console.error("1週間目標取得エラー:", weeklyError);
    }

    // 5. 制限ルールを取得
    const { data: restrictRule, error: restrictError } =
      await executeWithRetry<RestrictRuleData>(
        async () =>
          await supabase
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
      const { data: restrictItems, error: itemsError } = await executeWithRetry<
        RestrictRuleItem[]
      >(
        async () =>
          await supabase
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
        await supabase
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
      quarterGoal: quarterGoal?.description || "3ヶ月目標が設定されていません",
      oneMonthGoal: monthlyGoal?.description || "1ヶ月目標が設定されていません",
      oneWeekGoal: weeklyGoal?.description || "1週間目標が設定されていません",
      limitRules: limitRulesText || "制限ルールが設定されていません",
      dailyTasks: dailyTasksText || "日次タスクが設定されていません",
    };

    console.log("目標データ取得成功:", goalData);
    return goalData;
  } catch (error) {
    console.error("目標データ取得中にエラーが発生:", error);
    return null;
  }
}

// 目標データが存在するかチェックする関数
export async function checkUserHasGoals(userId: string): Promise<boolean> {
  try {
    console.log("目標存在チェック開始:", { userId });
    const supabase = getBrowserSupabaseClient();

    const { data, error } = await executeWithRetry<LifestyleData>(
      async () =>
        await supabase
          .from("IDEAL_LIFESTYLES")
          .select("id, user_id, description")
          .eq("user_id", userId)
          .limit(1)
          .single(),
      "目標存在チェック"
    );

    console.log("IDEAL_LIFESTYLES取得結果:", {
      data,
      error,
      userId,
      errorCode: error?.code,
      errorMessage: error?.message,
      errorDetails: error?.details,
    });

    const result = !error && !!data;
    console.log("目標存在チェック最終結果:", result);
    return result;
  } catch (error) {
    console.error("目標存在チェック中にエラー:", error);
    return false;
  }
}
