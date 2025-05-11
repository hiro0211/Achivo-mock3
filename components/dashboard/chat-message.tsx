import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User, AlertTriangle } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
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

  return (
    <div
      className={cn(
        "flex items-start space-x-2 mb-4",
        isAi || isError ? "justify-start" : "justify-end flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className={avatarBg}>{icon}</AvatarFallback>
      </Avatar>

      <div className={cn("px-4 py-3 rounded-lg max-w-[80%]", bgColor)}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
