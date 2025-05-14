import { toast } from "@/hooks/use-toast";

// 成功メッセージを表示
export function showSuccessMessage(message: string) {
  toast({
    title: "成功",
    description: message,
    variant: "default",
  });
}

// エラーメッセージを表示
export function showErrorMessage(message: string) {
  toast({
    title: "エラー",
    description: message,
    variant: "destructive",
  });
}

// 不足している変数に関するメッセージを表示
export function showMissingVariablesMessage(missingVariables: string[]) {
  toast({
    title: "入力が不足しています",
    description: `以下の情報が必要です: ${missingVariables.join(", ")}`,
    variant: "destructive",
  });
}
