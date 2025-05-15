/**
 * fetch + エラーハンドリングの共通ラッパー
 */
async function apiFetch<T>(path: string, body: object): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `${path} failed`);
  }
  return res.json();
}

export type DifyInput = Record<string, any>;

/**
 * Dify API 経由でメッセージ送信
 */
export function sendMessage(
  query: string,
  userId: string,
  conversationId: string,
  inputs: DifyInput = {}
) {
  return apiFetch("/api/dify", { query, userId, conversationId, inputs });
}

/**
 * 会話完了判定 API 呼び出し
 */
export function checkConversationCompletion(
  conversationId: string,
  userId: string
) {
  return apiFetch("/api/dify/check-completion", { conversationId, userId });
}

/**
 * 目標保存 API 呼び出し
 */
export function saveGoalsToDatabase(userId: string, conversationId: string) {
  return apiFetch("/api/save-goals", { userId, conversationId });
}
