import { Goal } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getProgressColor } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const daysRemaining = Math.ceil(
    (goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{goal.title}</CardTitle>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
        
        <div className="flex items-center justify-between text-sm mb-1">
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-1" />
            <span>{formatDate(goal.deadline)}</span>
          </div>
          <Badge variant="outline">
            {daysRemaining} days left
          </Badge>
        </div>
        
        <div className="w-full space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Progress</span>
            <span className={getProgressColor(goal.progress)}>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}