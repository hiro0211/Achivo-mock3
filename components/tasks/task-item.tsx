"use client";

import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, GripVertical } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, completed: boolean) => void;
}

export function TaskItem({ task, onComplete }: TaskItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleChange = (checked: boolean) => {
    onComplete(task.id, checked);
  };
  
  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center p-3 bg-card rounded-md border mb-2 group transition-all",
        task.completed && "opacity-60",
        isDragging && "border-primary shadow-sm"
      )}
    >
      <div 
        className="cursor-grab mr-2 opacity-40 group-hover:opacity-100"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <GripVertical size={16} />
      </div>
      
      <Checkbox 
        checked={task.completed} 
        onCheckedChange={handleChange}
        className="mr-3"
      />
      
      <div className="flex-1">
        <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        
        {task.dueDate && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <CalendarDays size={12} className="mr-1" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
      
      <div>{getPriorityBadge()}</div>
    </div>
  );
}