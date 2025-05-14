"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { Message, DifyInput } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [userName, setUserName] = useState("");
  const [idealFuture, setIdealFuture] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // サーバーエンドポイント経由でDify APIと通信
      const inputs: DifyInput = {
        user_name: userName,
        ideal_future: idealFuture,
      };

      // サーバーエンドポイント経由でDify APIと通信
      const response = await fetch("/api/dify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: content,
          conversationId,
          userId,
          inputs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "APIリクエストエラー");
      }

      const data = await response.json();

      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      // AIの応答を追加
      const aiMessage: Message = {
        id: data.message_id || `ai-${Date.now()}`,
        content: data.answer,
        sender: "ai",
        timestamp: new Date(data.created_at) || new Date(),
        userId: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("メッセージ送信エラー:", error);

      // エラーメッセージを表示
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "申し訳ありません。メッセージの送信中にエラーが発生しました。",
        sender: "error",
        timestamp: new Date(),
        userId: "system",
      };
      setMessages((prev) => [...prev, errorMessage]);
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
