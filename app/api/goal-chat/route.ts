import { NextRequest, NextResponse } from "next/server";
import { goalService } from "@/lib/services/goal-service";

export async function POST(req: NextRequest) {
  try {
    const { content, userId, conversationId, inputs } = await req.json();

    const result = await goalService.sendMessageAndCheckCompletion(
      content,
      userId,
      conversationId,
      inputs
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Goal chat API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
