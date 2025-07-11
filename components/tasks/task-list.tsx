"use client";

import { TaskItem } from "./task-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

interface TaskListProps {
  onAddTask?: () => void;
}

export function TaskList({ onAddTask }: TaskListProps) {
  const { tasks, loading, error, handleTaskComplete, reloadTasks } = useTasks();

  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask();
    } else {
      // デフォルトの動作
      alert("新しいタスクの追加機能は今後実装予定です");
    }
  };

  if (loading) {
    return <TaskListSkeleton />;
  }

  if (error) {
    return <TaskListError error={error} onRetry={reloadTasks} />;
  }

  return (
    <TaskListContent
      tasks={tasks}
      onTaskComplete={handleTaskComplete}
      onAddTask={handleAddTask}
    />
  );
}

// ローディング状態のコンポーネント
function TaskListSkeleton() {
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

// エラー状態のコンポーネント
interface TaskListErrorProps {
  error: string;
  onRetry: () => void;
}

function TaskListError({ error, onRetry }: TaskListErrorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg font-medium">Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            再試行
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// タスクリストの内容コンポーネント
interface TaskListContentProps {
  tasks: any[];
  onTaskComplete: (id: string, completed: boolean) => Promise<void>;
  onAddTask: () => void;
}

function TaskListContent({
  tasks,
  onTaskComplete,
  onAddTask,
}: TaskListContentProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg font-medium">Today's Tasks</CardTitle>
        <Button size="sm" onClick={onAddTask}>
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
              <TaskItem key={task.id} task={task} onComplete={onTaskComplete} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
