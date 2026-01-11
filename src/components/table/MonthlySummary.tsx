interface MonthlySummaryProps {
  totals: Record<string, number>;
}

export default function MonthlySummary({ totals }: MonthlySummaryProps) {
  return (
    <div className="monthly-summary">
      <h2>Итог за месяц</h2>

      {Object.entries(totals).map(([month, sum]) => (
        <div key={month} className="month-row">
          <strong>{month}</strong>: {sum}
        </div>
      ))}
    </div>
  );
}
