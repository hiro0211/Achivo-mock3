import { KPIGrid } from "@/components/progress/kpi-grid";
import { ProgressChart } from "@/components/progress/progress-chart";
import { ProgressRing } from "@/components/progress/progress-ring";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <KPIGrid />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ProgressChart />
        <div>
          <ProgressRing 
            title="Overall Progress"
            value={42}
            size="large"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
          <CardDescription>Track progress towards your individual goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ProgressRing title="Spanish" value={35} />
            <ProgressRing title="Mobile App" value={68} />
            <ProgressRing title="Marathon" value={42} />
            <ProgressRing title="Book" value={15} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}