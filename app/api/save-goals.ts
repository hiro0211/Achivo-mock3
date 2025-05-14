import { NextRequest, NextResponse } from "next/server";
import { saveGoals } from "@/lib/api/goals";

export async function POST(req: NextRequest) {
  const { userId, conversationId } = await req.json();
  const result = await saveGoals(userId, conversationId);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}
