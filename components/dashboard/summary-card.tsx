import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SummaryCard as SummaryCardType } from "@/types";
import { Target, CalendarClock, CheckCircle } from "lucide-react";

interface SummaryCardProps {
  card: SummaryCardType;
}

export function SummaryCard({ card }: SummaryCardProps) {
  const getIcon = () => {
    switch (card.type) {
      case "future":
        return <Target className="h-5 w-5 text-primary" />;
      case "goal":
        return <CalendarClock className="h-5 w-5 text-primary" />;
      case "task":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {getIcon()}
          <CardTitle className="text-md font-medium">{card.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">{card.content}</p>
      </CardContent>
      {card.progress !== undefined && (
        <CardFooter className="pt-0">
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Progress</span>
              <span>{card.progress}%</span>
            </div>
            <Progress value={card.progress} className="h-1.5" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}