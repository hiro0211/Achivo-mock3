// app/api/dify/check-completion/route.ts を作成
import { NextRequest, NextResponse } from "next/server";
import { difyClient } from "@/lib/api/dify-client";

export async function POST(req: NextRequest) {
  try {
    const { conversationId, userId } = await req.json();
    
    // conversationIdが空の場合はエラー
    if (!conversationId) {
      return NextResponse.json(
        { error: "conversation_id is required" },
        { status: 400 }
      );
    }
    
    const result = await difyClient.checkVariablesComplete({
      conversationId,
      userId,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("会話完了チェックエラー:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}