import { MOCK_GOALS } from "@/constants/mock-data";
import { GoalCard } from "./goal-card";

export function GoalsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {MOCK_GOALS.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}