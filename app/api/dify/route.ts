import { NextRequest, NextResponse } from "next/server";
import { difyClient } from "@/lib/api/dify-client";

/**
 * Dify APIとの通信を行うエンドポイント
 */
export async function POST(req: NextRequest) {
  try {
    const { query, conversationId, userId, inputs } = await req.json();
    const data = await difyClient.sendMessage({
      query,
      conversationId,
      userId,
      inputs,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API処理エラー:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
