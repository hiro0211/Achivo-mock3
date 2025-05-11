import { DifyInput } from "@/types";

const DIFY_API_URL = "https://api.dify.ai/v1/chat-messages";

export class DifyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(params: {
    query: string;
    conversationId?: string;
    userId: string;
    inputs?: DifyInput;
  }) {
    try {
      const requestBody = {
        query: params.query,
        response_mode: "blocking",
        conversation_id: params.conversationId || "",
        user: params.userId,
        inputs: params.inputs || {},
      };

      console.log("Difyリクエスト:", requestBody);

      const response = await fetch(DIFY_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Dify APIエラー:", errorText);
        throw new Error(
          `APIリクエストに失敗しました: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Difyレスポンス:", data);

      return data;
    } catch (error) {
      console.error("Dify API通信エラー:", error);
      throw error;
    }
  }
}
