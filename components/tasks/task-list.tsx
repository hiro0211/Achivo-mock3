"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { TaskItem } from "./task-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { getUserTasks, updateTaskCompletion } from "@/lib/task/task-service";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // コンポーネント初期化時にタスクを読み込み
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // 現在のユーザーを取得
        const supabase = getBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("ログインが必要です");
          return;
        }

        // タスクを取得
        const userTasks = await getUserTasks(user.id);
        setTasks(userTasks);
      } catch (err) {
        console.error("タスク読み込みエラー:", err);
        setError("タスクの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // 再読み込み用の関数（エラー時の再試行で使用）
  const reloadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = getBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("ログインが必要です");
        return;
      }

      const userTasks = await getUserTasks(user.id);
      setTasks(userTasks);
    } catch (err) {
      console.error("タスク読み込みエラー:", err);
      setError("タスクの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (id: string, completed: boolean) => {
    // UIを即座に更新（楽観的更新）
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed, updatedAt: new Date() } : task
      )
    );

    // Supabaseを更新
    const success = await updateTaskCompletion(id, completed);

    if (!success) {
      // 更新に失敗した場合は元に戻す
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
      setError("タスクの更新に失敗しました");
    }
  };

  const addNewTask = () => {
    // 実際のアプリでは、新しいタスクを追加するモーダルを開く
    // 今は簡単なプレースホルダーを表示
    alert("新しいタスクの追加機能は今後実装予定です");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg font-medium">Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>タスクを読み込み中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg font-medium">Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={reloadTasks} variant="outline">
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg font-medium">Today's Tasks</CardTitle>
        <Button size="sm" onClick={addNewTask}>
          <Plus size={16} className="mr-1" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            今日のタスクはありません。
          </p>
        ) : (
          <div>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={handleTaskComplete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
