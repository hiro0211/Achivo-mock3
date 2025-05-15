"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { Message, DifyInput } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  sendMessage,
  checkConversationCompletion,
  saveGoalsToDatabase,
} from "@/lib/api/chat";
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
  const [userName, setUserName] = useState("");
  const [idealFuture, setIdealFuture] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 例: Cookie取得時にSupabaseのCookie名だけを対象にする
    const supabaseCookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("sb-") && c.includes("-auth-token"));

    if (supabaseCookie) {
      // 既存のパース処理
    }
  }, []);

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
      // 入力を準備
      const inputs: DifyInput = {
        user_name: userName,
        ideal_future: idealFuture,
      };

      // lib/api/chat の関数を使用してメッセージを送信
      const data = await sendMessage(content, userId, conversationId, inputs);

      // AIの応答を追加
      const aiMessage: Message = {
        id: data.message_id || `ai-${Date.now()}`,
        content: data.answer,
        sender: "ai",
        timestamp: new Date(data.created_at) || new Date(),
        userId: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 重要: ここで新しい会話IDを取得したらそれを使用する
      if (data.conversation_id) {
        // 状態を更新（これは非同期なので後続の処理ではまだ反映されていない）
        setConversationId(data.conversation_id);

        // 新しく取得したIDを直接使用して会話完了チェック
        const completionResult = await checkConversationCompletion(
          data.conversation_id, // ここで直接data.conversation_idを使用
          userId
        );

        if (completionResult.isComplete) {
          // 目標を保存 - こちらも新しいIDを使用
          await saveGoalsToDatabase(userId, data.conversation_id);
          setIsComplete(true);
          showSuccessMessage("目標が保存されました");
        } else {
          // 不足している情報を表示
          showMissingVariablesMessage(completionResult.missingVariables);
        }
      }
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

      // エラーメッセージをトーストで表示
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
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="userName">あなたの名前</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="名前を入力..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="idealFuture">理想の未来</Label>
            <Input
              id="idealFuture"
              value={idealFuture}
              onChange={(e) => setIdealFuture(e.target.value)}
              placeholder="理想の未来を入力..."
              className="mt-1"
            />
          </div>
        </div>
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
