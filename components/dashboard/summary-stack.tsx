import { MOCK_SUMMARY_CARDS } from "@/constants/mock-data";
import { SummaryCard } from "./summary-card";

export function SummaryStack() {
  return (
    <div className="space-y-4">
      {MOCK_SUMMARY_CARDS.map((card) => (
        <SummaryCard key={card.id} card={card} />
      ))}
    </div>
  );
}