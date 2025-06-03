"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { Message } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showSuccessMessage, showErrorMessage } from "@/lib/api/notification";

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
        needsConfirmation: isGoalConfirmationMessage(result.response.answer),
        isConfirmed: false,
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
      }
      // 会話の途中段階では不足変数のアラートは表示しない
      // （AIとの対話で自然に情報を収集するため）
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

  // 目標確認が必要なメッセージかどうかを判定する関数
  const isGoalConfirmationMessage = (content: string): boolean => {
    // AIの返信で目標確認を求めるメッセージかどうかを判定
    const confirmationKeywords = [
      "確認",
      "OK",
      "よろしいでしょうか",
      "これで進めて",
      "問題ないでしょうか",
      "修正があれば",
    ];
    return confirmationKeywords.some((keyword) => content.includes(keyword));
  };

  // OKボタンがクリックされた時の処理
  const handleConfirmMessage = async (messageId: string) => {
    // メッセージを確認済みにマーク
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isConfirmed: true } : msg
      )
    );

    // Dify側に「OK」メッセージを送信
    await handleSendMessage("OK");
  };

  // 確認待ちの状態を計算
  const isWaitingForConfirmation = messages.some(
    (msg) => msg.needsConfirmation && !msg.isConfirmed
  );

  return (
    <Card className="flex flex-col h-[80vh] max-h-[800px] min-h-[700px]">
      <CardHeader className="py-4 px-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎯</span>
          </div>
          目標設定アシスタント
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          理想のライフスタイルを実現するための目標を一緒に設定しましょう
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onConfirm={handleConfirmMessage}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-6 border-t bg-gray-50">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isWaitingForConfirmation={false}
          />
          {isWaitingForConfirmation && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                ✨
                上記の内容を確認し、OKボタンを押してください。修正がある場合は、この欄にメッセージを入力してください。
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
