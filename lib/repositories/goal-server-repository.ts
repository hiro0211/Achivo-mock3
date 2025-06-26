import { getServiceSupabase } from "../supabase-server";

export interface GoalVariables {
  idealFuture: string;
  quarterGoal: string;
  oneMonthGoal: string;
  limitRules: string;
  oneWeekGoal: string;
  dailyTasks: string;
}

/**
 * サーバーサイド専用の目標データリポジトリ
 */
export class GoalServerRepository {
  /**
   * 目標データを階層的にSupabaseに保存（サーバーサイド用）
   */
  async saveGoalHierarchy(userId: string, variables: GoalVariables) {
    const supabase = getServiceSupabase();

    try {
      // タイムアウト付きで処理を実行
      const savePromise = this.executeGoalSave(userId, variables, supabase);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Goal save timeout")), 25000)
      );

      return await Promise.race([savePromise, timeoutPromise]);
    } catch (error) {
      console.error("目標保存エラー:", error);
      if (error instanceof Error && error.message === "Goal save timeout") {
        throw new Error(
          "目標保存がタイムアウトしました。処理を簡略化して再試行してください。"
        );
      }
      throw error;
    }
  }

  private async executeGoalSave(
    userId: string,
    variables: GoalVariables,
    supabase: any
  ) {
    // 1. 理想のライフスタイル
    const { data: lifestyle, error: lifestyleError } = await supabase
      .from("IDEAL_LIFESTYLES")
      .insert([{ user_id: userId, description: variables.idealFuture }])
      .select()
      .single();

    if (lifestyleError)
      throw new Error(
        `理想のライフスタイル保存エラー: ${lifestyleError.message}`
      );

    // 2. 3か月目標
    const { data: quarter, error: quarterError } = await supabase
      .from("QUARTER_GOALS")
      .insert([
        {
          user_id: userId,
          lifestyle_id: lifestyle.id,
          description: variables.quarterGoal,
        },
      ])
      .select()
      .single();

    if (quarterError)
      throw new Error(`3か月目標保存エラー: ${quarterError.message}`);

    // 3. 制限ルール
    const { data: restrict, error: restrictError } = await supabase
      .from("Restrict_Rule")
      .insert([
        {
          user_id: userId,
          quarter_goal_id: quarter.id,
          description: variables.limitRules,
        },
      ])
      .select()
      .single();

    if (restrictError)
      throw new Error(`制限ルール保存エラー: ${restrictError.message}`);

    // 4. 制限ルールアイテム
    const restrictItems = variables.limitRules
      .split("\n")
      .map((text) => ({
        restrict_rule_id: restrict.id,
        text: text.trim(),
      }))
      .filter((item) => item.text);

    // 5. 1か月目標
    const { data: month, error: monthError } = await supabase
      .from("MONTHLY_GOALS")
      .insert([
        {
          user_id: userId,
          quarter_id: quarter.id,
          description: variables.oneMonthGoal,
        },
      ])
      .select()
      .single();

    if (monthError)
      throw new Error(`1か月目標保存エラー: ${monthError.message}`);

    // 6. 1週間目標
    const { data: week, error: weekError } = await supabase
      .from("WEEKLY_GOALS")
      .insert([
        {
          user_id: userId,
          monthly_goal_id: month.id,
          description: variables.oneWeekGoal,
        },
      ])
      .select()
      .single();

    if (weekError) throw new Error(`1週間目標保存エラー: ${weekError.message}`);

    // 7. 日次タスク
    const todos = variables.dailyTasks
      .split("\n")
      .map((title) => ({
        user_id: userId,
        weekly_goal_id: week.id,
        title: title.trim(),
      }))
      .filter((item) => item.title);

    // 並列処理でアイテムを保存
    const promises = [];

    if (restrictItems.length > 0) {
      promises.push(
        supabase
          .from("RESTRICT_RULE_ITEMS")
          .insert(restrictItems)
          .then((result: any) => {
            if (result.error) {
              throw new Error(
                `制限ルールアイテム保存エラー: ${result.error.message}`
              );
            }
            return result;
          })
      );
    }

    if (todos.length > 0) {
      promises.push(
        supabase
          .from("TODOS")
          .insert(todos)
          .then((result: any) => {
            if (result.error) {
              throw new Error(`日次タスク保存エラー: ${result.error.message}`);
            }
            return result;
          })
      );
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }

    return { success: true };
  }
}

export const goalServerRepository = new GoalServerRepository();
