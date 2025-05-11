"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  title: string;
  value: number;
  size?: "small" | "medium" | "large";
}

export function ProgressRing({ 
  title, 
  value, 
  size = "medium" 
}: ProgressRingProps) {
  const getColorClass = () => {
    if (value < 30) return "text-destructive";
    if (value < 70) return "text-amber-500";
    return "text-emerald-500";
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return { ring: "h-24 w-24", text: "text-xl" };
      case "large":
        return { ring: "h-40 w-40", text: "text-4xl" };
      default: // medium
        return { ring: "h-32 w-32", text: "text-3xl" };
    }
  };
  
  const sizeClasses = getSizeClasses();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg
            className={cn("absolute -rotate-90", sizeClasses.ring)}
            viewBox="0 0 100 100"
          >
            <circle
              className="text-muted stroke-current"
              strokeWidth="10"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className={cn("stroke-current", getColorClass())}
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray={`${value * 2.51} 251.2`}
            />
          </svg>
          <div className="flex flex-col items-center justify-center text-center">
            <span className={cn("font-bold", sizeClasses.text, getColorClass())}>
              {value}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}