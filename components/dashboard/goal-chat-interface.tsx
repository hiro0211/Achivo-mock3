"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { Message } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  showSuccessMessage,
  showMissingVariablesMessage,
  showErrorMessage,
} from "@/lib/api/notification";

interface GoalChatInterfaceProps {
  userId: string;
}

export function GoalChatInterface({ userId }: GoalChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      content:
        "理想のライフスタイルを教えてください。理想に向けてお手伝いします。",
      sender: "ai",
      timestamp: new Date(),
      userId: "system",
    },
  ]);
  const [conversationId, setConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
      userId,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API Route経由でサービスを呼び出し
      const response = await fetch("/api/goal-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          userId,
          conversationId,
          inputs: {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API呼び出しに失敗しました");
      }

      const result = await response.json();

      // AIの応答を追加
      const aiMessage: Message = {
        id: result.response.message_id || `ai-${Date.now()}`,
        content: result.response.answer,
        sender: "ai",
        timestamp: new Date(result.response.created_at) || new Date(),
        userId: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 会話IDを更新
      if (result.response.conversation_id) {
        setConversationId(result.response.conversation_id);
      }

      // 完了状態に応じて処理
      if (result.isComplete) {
        setIsComplete(true);
        showSuccessMessage("目標が保存されました");
      } else {
        showMissingVariablesMessage(result.missingVariables);
      }
    } catch (error) {
      console.error("メッセージ送信エラー:", error);

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "申し訳ありません。メッセージの送信中にエラーが発生しました。",
        sender: "error",
        timestamp: new Date(),
        userId: "system",
      };
      setMessages((prev) => [...prev, errorMessage]);

      showErrorMessage(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="py-3 px-4 border-b">
        <CardTitle className="text-lg font-medium">
          目標設定アシスタント
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}
