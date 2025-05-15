import { NextRequest, NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  getServiceSupabase,
} from "../supabase-server";
import { sendMessage } from "./chat";

// supabaseServerをgetServiceSupabase()に変更
const supabaseServer = getServiceSupabase();

// Difyの会話変数を取得し、supabaseに各目標を保存する関数
export async function saveGoals(userId: string, conversationId: string) {
  try {
    console.log("目標保存開始:", { userId, conversationId });

    // 1. Difyから会話変数を取得（/api/dify/check-completionを使用）
    const completionResult = await fetch("/api/dify/check-completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, userId }),
    }).then((res) => res.json());

    const variables = completionResult.variables || [];
    console.log("取得した変数:", variables);

    // 2. 変数を抽出
    const getVar = (name: string) =>
      variables.find((v: any) => v.name === name)?.value;

    const idealFuture = getVar("Ideal_Future");
    const quarterGoal = getVar("Quarter_goal");
    const oneMonthGoal = getVar("OneMonth_Goal");
    const limitRules = getVar("Limit_Rules"); // 捨てるもの（改行区切りのテキスト想定）
    const oneWeekGoal = getVar("OneWeek_Goal");
    const dailyTasks = getVar("Daily_Tasks"); // 日次タスク（改行区切りのテキスト想定）

    console.log("抽出した目標:", {
      idealFuture,
      quarterGoal,
      oneMonthGoal,
      limitRules,
      oneWeekGoal,
      dailyTasks,
    });

    // 3. DB保存
    // 3-1. 理想のライフスタイル
    const { data: lifestyle, error: lifestyleError } = await supabaseServer
      .from("IDEAL_LIFESTYLES")
      .insert([{ user_id: userId, description: idealFuture }])
      .select()
      .single();

    if (lifestyleError) {
      console.error("理想のライフスタイル保存エラー:", lifestyleError);
      return { error: lifestyleError.message };
    }

    // 3-2. 3か月目標
    const { data: quarter, error: quarterError } = await supabaseServer
      .from("QUARTER_GOALS")
      .insert([
        {
          user_id: userId,
          lifestyle_id: lifestyle.id,
          description: quarterGoal,
        },
      ])
      .select()
      .single();

    if (quarterError) {
      console.error("3か月目標保存エラー:", quarterError);
      return { error: quarterError.message };
    }

    // 3-3. 捨てるもの（Restrict_Rule & RESTRICT_RULE_ITEMS）
    const { data: restrict, error: restrictError } = await supabaseServer
      .from("Restrict_Rule")
      .insert([
        {
          user_id: userId,
          quarter_goal_id: quarter.id,
          description: limitRules,
        },
      ])
      .select()
      .single();

    if (restrictError) {
      console.error("捨てるもの保存エラー:", restrictError);
      return { error: restrictError.message };
    }

    // 捨てるものを1行ずつRESTRICT_RULE_ITEMSに
    const items = (limitRules || "")
      .split("\n")
      .map((text: string) => ({
        restrict_rule_id: restrict.id,
        text: text.trim(),
      }))
      .filter((item: any) => item.text);

    if (items.length > 0) {
      const { error: itemsError } = await supabaseServer
        .from("RESTRICT_RULE_ITEMS")
        .insert(items);
      if (itemsError) {
        console.error("捨てるものアイテム保存エラー:", itemsError);
        return { error: itemsError.message };
      }
    }

    // 3-4. 1か月目標
    const { data: month, error: monthError } = await supabaseServer
      .from("MONTHLY_GOALS")
      .insert([
        { user_id: userId, quarter_id: quarter.id, description: oneMonthGoal },
      ])
      .select()
      .single();

    if (monthError) {
      console.error("1か月目標保存エラー:", monthError);
      return { error: monthError.message };
    }

    // 3-5. 1週間目標
    const { data: week, error: weekError } = await supabaseServer
      .from("WEEKLY_GOALS")
      .insert([
        {
          user_id: userId,
          monthly_goal_id: month.id,
          description: oneWeekGoal,
        },
      ])
      .select()
      .single();

    if (weekError) {
      console.error("1週間目標保存エラー:", weekError);
      return { error: weekError.message };
    }

    // 3-6. 日次タスク
    const todos = (dailyTasks || "")
      .split("\n")
      .map((title: string) => ({
        user_id: userId,
        weekly_goal_id: week.id,
        title: title.trim(),
      }))
      .filter((item: any) => item.title);

    if (todos.length > 0) {
      const { error: todosError } = await supabaseServer
        .from("TODOS")
        .insert(todos);
      if (todosError) {
        console.error("日次タスク保存エラー:", todosError);
        return { error: todosError.message };
      }
    }

    console.log("目標保存完了");
    return { result: "success" };
  } catch (error) {
    console.error("目標保存中にエラーが発生:", error);
    return { error: "予期せぬエラーが発生しました" };
  }
}
