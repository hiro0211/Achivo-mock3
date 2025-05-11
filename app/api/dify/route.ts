import { NextRequest, NextResponse } from "next/server";
import { DifyClient } from "@/lib/api/dify";

/**
 * Dify APIとの通信を行うエンドポイント
 */
export async function POST(req: NextRequest) {
  try {
    const { query, conversationId, userId, inputs } = await req.json();
    const DIFY_API_KEY = process.env.DIFY_API_KEY;

    if (!DIFY_API_KEY) {
      return NextResponse.json(
        { error: "Dify API key is not configured" },
        { status: 500 }
      );
    }

    const difyClient = new DifyClient(DIFY_API_KEY);
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
