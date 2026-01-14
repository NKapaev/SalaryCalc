import styles from './dayTable.module.css';

interface MonthlySummaryProps {
  totals: Record<string, number>;
}

export default function MonthlySummary({ totals }: MonthlySummaryProps) {
  return (
    <div className="monthly-summary">
      <h2>Всего за месяц</h2>

      {Object.entries(totals).map(([month, sum]) => (
        <div key={month} className="month-row">
          <p className={styles.monthlySummary}>
            {month} : {sum}
          </p>
        </div>
      ))}
    </div>
  );
}
