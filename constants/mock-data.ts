import { Goal, KPI, Message, ProgressData, SummaryCard, Task } from "@/types";

export const MOCK_GOALS: Goal[] = [
  {
    id: "1",
    title: "Learn Spanish",
    description: "Achieve B1 level proficiency in Spanish",
    deadline: new Date(2024, 11, 31),
    progress: 35,
    userId: "user1",
    createdAt: new Date(2024, 3, 1),
    updatedAt: new Date(2024, 3, 10)
  },
  {
    id: "2",
    title: "Launch Mobile App",
    description: "Complete and launch the mobile app version of my productivity tool",
    deadline: new Date(2024, 8, 30),
    progress: 68,
    userId: "user1",
    createdAt: new Date(2024, 1, 15),
    updatedAt: new Date(2024, 3, 12)
  },
  {
    id: "3",
    title: "Run Half Marathon",
    description: "Train and complete a half marathon",
    deadline: new Date(2024, 9, 15),
    progress: 42,
    userId: "user1",
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 3, 11)
  },
  {
    id: "4",
    title: "Write Book",
    description: "Complete first draft of my novel",
    deadline: new Date(2024, 11, 1),
    progress: 15,
    userId: "user1",
    createdAt: new Date(2024, 1, 10),
    updatedAt: new Date(2024, 3, 9)
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Complete Spanish lesson 12",
    completed: false,
    goalId: "1",
    userId: "user1",
    dueDate: new Date(2024, 3, 25),
    priority: "high",
    createdAt: new Date(2024, 3, 10),
    updatedAt: new Date(2024, 3, 10)
  },
  {
    id: "2",
    title: "Design app onboarding screens",
    completed: true,
    goalId: "2",
    userId: "user1",
    dueDate: new Date(2024, 3, 18),
    priority: "medium",
    createdAt: new Date(2024, 3, 9),
    updatedAt: new Date(2024, 3, 15)
  },
  {
    id: "3",
    title: "Run 5k training session",
    completed: false,
    goalId: "3",
    userId: "user1",
    dueDate: new Date(2024, 3, 20),
    priority: "medium",
    createdAt: new Date(2024, 3, 11),
    updatedAt: new Date(2024, 3, 11)
  },
  {
    id: "4",
    title: "Outline chapter 3",
    completed: false,
    goalId: "4",
    userId: "user1",
    dueDate: new Date(2024, 3, 22),
    priority: "low",
    createdAt: new Date(2024, 3, 12),
    updatedAt: new Date(2024, 3, 12)
  },
  {
    id: "5",
    title: "Review app analytics",
    completed: false,
    goalId: "2",
    userId: "user1",
    dueDate: new Date(2024, 3, 21),
    priority: "low",
    createdAt: new Date(2024, 3, 13),
    updatedAt: new Date(2024, 3, 13)
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Hi, I need help setting a goal to learn Spanish. What do you suggest?",
    sender: "user",
    timestamp: new Date(2024, 3, 15, 14, 30),
    userId: "user1"
  },
  {
    id: "2",
    content: "That's a great goal! I recommend starting with daily 15-minute practice sessions. Would you like me to create a structured plan for you?",
    sender: "ai",
    timestamp: new Date(2024, 3, 15, 14, 31),
    userId: "user1"
  },
  {
    id: "3",
    content: "Yes, that would be helpful. I want to reach B1 level by the end of the year.",
    sender: "user",
    timestamp: new Date(2024, 3, 15, 14, 33),
    userId: "user1"
  },
  {
    id: "4",
    content: "Perfect! I've created a 9-month plan to reach B1 level. It includes daily vocabulary practice, weekly grammar lessons, and bi-weekly conversation practice. I've added it to your goals with recommended tasks.",
    sender: "ai",
    timestamp: new Date(2024, 3, 15, 14, 35),
    userId: "user1"
  }
];

export const MOCK_SUMMARY_CARDS: SummaryCard[] = [
  {
    id: "1",
    title: "Your Ideal Future",
    content: "Fluent in Spanish, running half marathons, with a published book and a successful mobile app.",
    type: "future",
    userId: "user1"
  },
  {
    id: "2",
    title: "3-Month Goals",
    content: "Complete Spanish A2 level, finish app MVP, run 10k without stopping, write 3 book chapters.",
    type: "goal",
    progress: 40,
    userId: "user1"
  },
  {
    id: "3",
    title: "This Week's Tasks",
    content: "Complete Spanish lessons 12-15, design app onboarding, run 5k twice, outline chapter 3.",
    type: "task",
    progress: 25,
    userId: "user1"
  }
];

export const MOCK_PROGRESS_DATA: ProgressData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    value: 20 + Math.floor(Math.random() * 40) + i / 2
  };
});

export const MOCK_KPIS: KPI[] = [
  {
    id: "1",
    title: "Goal Completion",
    value: "40%",
    target: 100,
    change: 5,
    userId: "user1"
  },
  {
    id: "2",
    title: "Tasks Completed",
    value: 24,
    target: 30,
    change: 3,
    userId: "user1"
  },
  {
    id: "3",
    title: "Weekly Streak",
    value: 6,
    change: 2,
    userId: "user1"
  }
];