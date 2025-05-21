export type DifyInput = Record<string, any>;

export class DifyClient {
  private apiKey: string;
  public baseUrl = 'https://api.dify.ai/v1';

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
    inputs?: DifyInput;
  }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      console.error('DifyClient.sendMessage error:', error);
      throw new Error(error.error || 'DifyClient.sendMessage failed');
    }
    const data = await res.json();
    console.log('DifyClient.sendMessage response:', data);
    return data;
  }

  /**
   * 会話変数をチェックして全て揃っているか判定
   */
  async checkVariablesComplete(params: {
    conversationId: string;
    userId: string;
  }): Promise<{ isComplete: boolean; missingVariables: string[] }> {
    const url = `${this.baseUrl}/conversations/${params.conversationId}/variables?user=${params.userId}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      console.error('DifyClient.checkVariablesComplete error:', error);
      throw new Error(error.error || 'DifyClient.checkVariablesComplete failed');
    }
    const { data } = await res.json();
    const missing = (data as any[])
      .filter(v => !v.value)
      .map(v => v.name as string);
    return { isComplete: missing.length === 0, missingVariables: missing };
  }
}

// API キーは環境変数から取得
export const difyClient = new DifyClient(process.env.DIFY_API_KEY!);