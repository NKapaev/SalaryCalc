import styles from './monthNavigator.module.css';

interface MonthNavigatorProps {
  month: Date;
  onChange: (newMonth: Date) => void;
}

export default function MonthNavigator({
  month,
  onChange,
}: MonthNavigatorProps) {
  function prevMonth() {
    onChange(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  }

  function nextMonth() {
    onChange(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  }

  const label = month.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.navigator}>
      <button onClick={prevMonth}>◀</button>
      <span className={styles.label}>{label}</span>
      <button onClick={nextMonth}>▶</button>
    </div>
  );
}
