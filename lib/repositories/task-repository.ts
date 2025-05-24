import { Task } from "@/types";
import {
  getBrowserSupabaseClient,
  refreshToken,
} from "@/lib/supabase/browser-client";

// Supabaseテーブルの型定義
interface TodoRow {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  priority: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * トークンエラーかどうかをチェック
 */
function isTokenError(error: any): boolean {
  return (
    error?.message?.includes("JWT expired") ||
    error?.message?.includes("invalid_token") ||
    error?.code === "invalid_token" ||
    error?.status === 401
  );
}

/**
 * リトライ付きでSupabaseクエリを実行
 */
async function executeWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: any | null }>,
  description: string
): Promise<{ data: T | null; error: any | null }> {
  let result = await queryFn();

  // トークンエラーの場合、リフレッシュを試行して再実行
  if (result.error && isTokenError(result.error)) {
    console.log(
      `${description}でトークンエラーが発生、リフレッシュを試行:`,
      result.error
    );

    const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
      console.log(`トークンリフレッシュ成功、${description}を再実行`);
      result = await queryFn();
    } else {
      console.error(`トークンリフレッシュ失敗、${description}のリトライを断念`);
    }
  }

  return result;
}

/**
 * SupabaseのTodoRowをTaskインターフェースに変換
 */
function mapTodoRowToTask(row: TodoRow): Task {
  const priority = row.priority?.toLowerCase() as
    | "low"
    | "medium"
    | "high"
    | undefined;

  return {
    id: row.id,
    title: row.title,
    completed: row.is_completed,
    userId: row.user_id,
    dueDate: row.deadline ? new Date(row.deadline) : undefined,
    priority: priority || "medium",
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export class TaskRepository {
  /**
   * ユーザーのタスク一覧を取得
   */
  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      console.log("タスクデータ取得開始:", { userId });

      const supabase = getBrowserSupabaseClient();

      const { data: todos, error } = await executeWithRetry<TodoRow[]>(
        async () =>
          await supabase
            .from("TODOS")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
        "タスク一覧取得"
      );

      if (error) {
        console.error("タスク取得エラー:", error);
        return [];
      }

      if (!todos || !Array.isArray(todos)) {
        console.log("タスクデータが見つかりません");
        return [];
      }

      const tasks = todos.map(mapTodoRowToTask);
      console.log("タスクデータ取得成功:", { taskCount: tasks.length });

      return tasks;
    } catch (error) {
      console.error("タスクデータ取得中にエラーが発生:", error);
      return [];
    }
  }

  /**
   * タスクの完了状態を更新
   */
  async updateTaskCompletion(
    taskId: string,
    completed: boolean
  ): Promise<boolean> {
    try {
      console.log("タスク完了状態更新開始:", { taskId, completed });

      const supabase = getBrowserSupabaseClient();

      const { error } = await executeWithRetry<null>(
        async () =>
          await supabase
            .from("TODOS")
            .update({
              is_completed: completed,
              updated_at: new Date().toISOString(),
            })
            .eq("id", taskId),
        "タスク完了状態更新"
      );

      if (error) {
        console.error("タスク更新エラー:", error);
        return false;
      }

      console.log("タスク完了状態更新成功");
      return true;
    } catch (error) {
      console.error("タスク更新中にエラーが発生:", error);
      return false;
    }
  }
}

export const taskRepository = new TaskRepository();

// 後方互換性のための関数エクスポート
export async function getUserTasks(userId: string): Promise<Task[]> {
  return taskRepository.getUserTasks(userId);
}

export async function updateTaskCompletion(
  taskId: string,
  completed: boolean
): Promise<boolean> {
  return taskRepository.updateTaskCompletion(taskId, completed);
}
