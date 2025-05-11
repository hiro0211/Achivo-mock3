import { Card, CardContent } from "@/components/ui/card";
import { KPI } from "@/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const renderChangeIndicator = () => {
    if (kpi.change === undefined) return null;
    
    const isPositive = kpi.change > 0;
    return (
      <div className={cn(
        "flex items-center text-xs font-medium",
        isPositive ? "text-emerald-500" : "text-destructive"
      )}>
        {isPositive ? (
          <ArrowUp className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDown className="h-3 w-3 mr-1" />
        )}
        <span>{Math.abs(kpi.change)}{typeof kpi.value === 'string' && kpi.value.includes('%') ? '%' : ''}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold mb-1">{kpi.value}</div>
        <div className="text-sm text-muted-foreground mb-2">{kpi.title}</div>
        {renderChangeIndicator()}
        {kpi.target && (
          <div className="text-xs text-muted-foreground mt-1">
            Target: {kpi.target}{typeof kpi.value === 'string' && kpi.value.includes('%') ? '%' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}