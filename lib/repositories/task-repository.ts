import { Task } from "@/types";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";
import { executeWithRetry } from "../utils/error-handler";

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

      if (error || !todos || !Array.isArray(todos)) {
        return [];
      }

      return todos.map(mapTodoRowToTask);
    } catch (error) {
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
      const supabase = getBrowserSupabaseClient();

      const { error } = await executeWithRetry(
        async () =>
          await supabase
            .from("TODOS")
            .update({
              completed,
              updated_at: new Date().toISOString(),
            })
            .eq("id", taskId),
        "タスク完了状態更新"
      );

      return !error;
    } catch (error) {
      return false;
    }
  }
}

// インスタンス化されたリポジトリをエクスポート
const taskRepository = new TaskRepository();

export const getUserTasks = (userId: string) =>
  taskRepository.getUserTasks(userId);
export const updateTaskCompletion = (taskId: string, completed: boolean) =>
  taskRepository.updateTaskCompletion(taskId, completed);
