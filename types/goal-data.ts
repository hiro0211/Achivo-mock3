export interface GoalData {
  idealFuture: string;
  quarterGoal: string;
  oneMonthGoal: string;
  oneWeekGoal: string;
  limitRules: string;
  dailyTasks: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}
