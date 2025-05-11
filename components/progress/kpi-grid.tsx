import { MOCK_KPIS } from "@/constants/mock-data";
import { KPICard } from "./kpi-card";

export function KPIGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MOCK_KPIS.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}