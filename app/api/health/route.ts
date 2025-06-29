import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // 簡単なクエリでSupabaseの接続を確認
    const { data, error } = await supabase
      .from("IDEAL_LIFESTYLES")
      .select("id")
      .limit(1);

    if (error && error.code !== "PGRST116") {
      // テーブルが空の場合のエラーは無視
      throw error;
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      supabase: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
