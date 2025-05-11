"use client";

import { useState } from "react";
import { Task } from "@/types";
import { TaskItem } from "./task-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { MOCK_TASKS } from "@/constants/mock-data";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(
      tasks.map((task) => 
        task.id === id ? { ...task, completed, updatedAt: new Date() } : task
      )
    );
  };

  const addNewTask = () => {
    // In a real app, this would open a modal to add a new task
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New task",
      completed: false,
      userId: "user1",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks([...tasks, newTask]);
  };

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
          <p className="text-center text-muted-foreground py-4">No tasks for today.</p>
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