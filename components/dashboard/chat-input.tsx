"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isWaitingForConfirmation?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  isWaitingForConfirmation = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <div className="flex space-x-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isWaitingForConfirmation
              ? "修正がある場合は、ここに詳細を入力してください..."
              : "メッセージを入力してください... (Shift+Enterで改行)"
          }
          className="flex-1 min-h-[100px] max-h-[200px] resize-none border-2 border-gray-200 focus:border-blue-400 rounded-lg p-4 text-base"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className="h-[100px] w-[60px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <SendHorizontal size={24} />
          )}
          <span className="sr-only">送信</span>
        </Button>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span>💡 ヒント: Enterで送信、Shift+Enterで改行</span>
      </div>
    </form>
  );
}
