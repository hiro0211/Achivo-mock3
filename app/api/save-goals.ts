import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // サーバー側はService Role Keyを使う
);

const DIFY_API_KEY = process.env.DIFY_API_KEY;

export async function POST(req: NextRequest) {
  const { userId, conversationId } = await req.json();

  // 1. Difyから会話変数を取得
  const difyRes = await fetch(
    `https://api.dify.ai/v1/conversations/${conversationId}/variables?user=${userId}`,
    {
      headers: { Authorization: `Bearer ${DIFY_API_KEY}` },
    }
  );
  const { data: variables } = await difyRes.json();

  // 2. 変数を抽出
  const getVar = (name: string) =>
    variables.find((v: any) => v.name === name)?.value;
  

  const idealFuture = getVar("Ideal_Future");
  const quarterGoal = getVar("Quarter_goal");
  const oneMonthGoal = getVar("OneMonth_Goal");
  const limitRules = getVar("Limit_Rules"); // 捨てるもの（改行区切りのテキスト想定）
  const oneWeekGoal = getVar("OneWeek_Goal");
  const dailyTasks = getVar("Daily_Tasks"); // 日次タスク（改行区切りのテキスト想定）

  console.log(idealFuture);
  // 3. DB保存
  // 3-1. 理想のライフスタイル
  const { data: lifestyle, error: lifestyleError } = await supabase
    .from("IDEAL_LIFESTYLES")
    .insert([{ user_id: userId, description: idealFuture }])
    .select()
    .single();

  if (lifestyleError)
    return NextResponse.json(
      { error: lifestyleError.message },
      { status: 500 }
    );

  // 3-2. 3か月目標
  const { data: quarter, error: quarterError } = await supabase
    .from("QUARTER_GOALS")
    .insert([
      { user_id: userId, lifestyle_id: lifestyle.id, description: quarterGoal },
    ])
    .select()
    .single();

  if (quarterError)
    return NextResponse.json({ error: quarterError.message }, { status: 500 });

  // 3-3. 捨てるもの（Restrict_Rule & RESTRICT_RULE_ITEMS）
  const { data: restrict, error: restrictError } = await supabase
    .from("Restrict_Rule")
    .insert([
      { user_id: userId, quarter_goal_id: quarter.id, description: limitRules },
    ])
    .select()
    .single();

  if (restrictError)
    return NextResponse.json({ error: restrictError.message }, { status: 500 });

  // 捨てるものを1行ずつRESTRICT_RULE_ITEMSに
  const items = (limitRules || "")
    .split("\n")
    .map((text: string) => ({
      restrict_rule_id: restrict.id,
      text: text.trim(),
    }))
    .filter((item: any) => item.text);

  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from("RESTRICT_RULE_ITEMS")
      .insert(items);
    if (itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // 3-4. 1か月目標
  const { data: month, error: monthError } = await supabase
    .from("MONTHLY_GOALS")
    .insert([
      { user_id: userId, quarter_id: quarter.id, description: oneMonthGoal },
    ])
    .select()
    .single();

  if (monthError)
    return NextResponse.json({ error: monthError.message }, { status: 500 });

  // 3-5. 1週間目標
  const { data: week, error: weekError } = await supabase
    .from("WEEKLY_GOALS")
    .insert([
      { user_id: userId, monthly_goal_id: month.id, description: oneWeekGoal },
    ])
    .select()
    .single();

  if (weekError)
    return NextResponse.json({ error: weekError.message }, { status: 500 });

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
    const { error: todosError } = await supabase.from("TODOS").insert(todos);
    if (todosError)
      return NextResponse.json({ error: todosError.message }, { status: 500 });
  }

  return NextResponse.json({ result: "success" });
}
