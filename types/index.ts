export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  progress: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  goalId?: string;
  userId: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "system" | "error";
  timestamp: Date;
  userId: string;
  needsConfirmation?: boolean;
  isConfirmed?: boolean;
}

export interface ProgressData {
  date: string;
  value: number;
}

export interface KPI {
  id: string;
  title: string;
  value: number | string;
  target?: number;
  change?: number;
  userId: string;
}

export type NavItem = {
  title: string;
  href: string;
  icon: string;
};

export interface DifyInput {
  user_name?: string;
  ideal_future?: string;
}

export interface SummaryCard {
  id: string;
  title: string;
  content: string;
  type: "future" | "goal" | "task";
  progress?: number;
  userId: string;
}

// Goal data types moved to ./goal-data.ts
export * from "./goal-data";
