export class DifyService {
  private apiKey: string;
  private baseUrl = "https://api.dify.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * チャットメッセージを送信
   */
  async sendMessage(params: {
    query: string;
    userId: string;
    conversationId?: string;
    inputs?: Record<string, any>;
  }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        query: params.query,
        user: params.userId,
        conversation_id: params.conversationId,
        inputs: params.inputs ?? {},
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Dify API呼び出しに失敗しました");
    }

    return res.json();
  }

  /**
   * 会話変数を取得
   */
  async getConversationVariables(
    conversationId: string,
    userId: string
  ): Promise<any[]> {
    const res = await fetch(
      `${this.baseUrl}/conversations/${conversationId}/variables?user=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "会話変数の取得に失敗しました");
    }

    const { data } = await res.json();
    return data;
  }

  /**
   * 会話変数の完了チェック
   */
  async checkVariablesComplete(
    conversationId: string,
    userId: string
  ): Promise<{
    isComplete: boolean;
    missingVariables: string[];
  }> {
    const variables = await this.getConversationVariables(
      conversationId,
      userId
    );
    const missing = variables.filter((v) => !v.value).map((v) => v.name);

    return {
      isComplete: missing.length === 0,
      missingVariables: missing,
    };
  }
}

// サーバーサイドでのみインスタンス化
export const createDifyService = () => {
  if (typeof window !== "undefined") {
    throw new Error("DifyService should only be used on the server side");
  }
  return new DifyService(process.env.DIFY_API_KEY!);
};
