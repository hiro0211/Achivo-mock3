import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, User, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onConfirm?: (messageId: string) => void;
}

export function ChatMessage({ message, onConfirm }: ChatMessageProps) {
  const isAi = message.sender === "ai";
  const isError = message.sender === "error";

  let bgColor = "bg-primary text-primary-foreground";
  let icon = <User size={16} />;
  let avatarBg = "bg-secondary";

  if (isAi) {
    bgColor = "bg-secondary text-secondary-foreground";
    icon = <Bot size={16} />;
    avatarBg = "bg-primary text-primary-foreground";
  } else if (isError) {
    bgColor = "bg-destructive text-destructive-foreground";
    icon = <AlertTriangle size={16} />;
    avatarBg = "bg-destructive text-destructive-foreground";
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(message.id);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start space-x-3 mb-6",
        isAi || isError ? "justify-start" : "justify-end flex-row-reverse"
      )}
    >
      <Avatar className="h-10 w-10 mt-1 shadow-md">
        <AvatarFallback className={avatarBg}>{icon}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col space-y-3 max-w-[85%]">
        <div className={cn("px-5 py-4 rounded-2xl shadow-sm", bgColor)}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
          <span className="text-xs opacity-70 mt-2 block">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* OKボタンの表示 */}
        {message.needsConfirmation && !message.isConfirmed && (
          <div className="flex justify-start">
            <Button
              onClick={handleConfirm}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl border-0"
            >
              <CheckCircle2 size={20} className="mr-2" />
              OK - この内容で進める
            </Button>
          </div>
        )}

        {/* 確認済みメッセージ */}
        {message.needsConfirmation && message.isConfirmed && (
          <div className="flex justify-start">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
              <CheckCircle2 size={16} className="inline mr-2" />
              確認済み
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
