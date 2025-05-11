import { GoalsGrid } from "@/components/goals/goals-grid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>
            Track progress and manage your long-term objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoalsGrid />
        </CardContent>
      </Card>
    </div>
  );
}