import styles from './dayTable.module.css';

interface MonthlySummaryProps {
  monthLabel: string;
  sum: number;
}

export default function MonthlySummary({
  monthLabel,
  sum,
}: MonthlySummaryProps) {
  return (
    <div className="monthly-summary">
      <h2>Всего за месяц</h2>

      <div className="month-row">
        <p className={styles.monthlySummary}>
          {monthLabel} : {sum}
        </p>
      </div>
    </div>
  );
}
