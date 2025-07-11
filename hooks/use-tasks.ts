import { useState, useEffect } from "react";
import { Task } from "@/types";
import {
  getUserTasks,
  updateTaskCompletion,
} from "@/lib/repositories/task-repository";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";
import { useUser } from "@/lib/auth-utils";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  handleTaskComplete: (id: string, completed: boolean) => Promise<void>;
  reloadTasks: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    if (!user?.id) {
      setError("ログインが必要です");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userTasks = await getUserTasks(user.id);
      setTasks(userTasks);
    } catch (err) {
      setError("タスクの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user?.id]);

  const handleTaskComplete = async (id: string, completed: boolean) => {
    // 楽観的更新
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed, updatedAt: new Date() } : task
    );
    setTasks(updatedTasks);

    // サーバー更新
    const success = await updateTaskCompletion(id, completed);

    if (!success) {
      // ロールバック
      const rollbackTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !completed } : task
      );
      setTasks(rollbackTasks);
      setError("タスクの更新に失敗しました");
    }
  };

  const reloadTasks = async () => {
    await loadTasks();
  };

  return {
    tasks,
    loading,
    error,
    handleTaskComplete,
    reloadTasks,
  };
}
