import styles from './dayTable.module.css';

import Row from '../row/Row';
import { formatDisplayDate } from '../../helpers/production';
import type { ProductionRow } from '../../types';

interface DayTableProps {
  date: string;
  rows: ProductionRow[];
  onDeleteRow: (index: number) => void;
}

export default function DayTable({ date, rows, onDeleteRow }: DayTableProps) {
  const total = rows.reduce((sum, r) => sum + r.summary, 0);

  return (
    <div className="day-table">
      <h3>{formatDisplayDate(date)}</h3>

      <div className={`${styles.row} ${styles.header}`}>
        <div className={styles.cell}>Код</div>
        <div className={styles.cell}>Операция</div>
        <div className={styles.cell}>Цена</div>
        <div className={styles.cell}>Кол-во</div>
        <div className={styles.cell}>Сумма</div>
        <div />
      </div>

      {rows.map((row, i) => (
        <Row key={i} row={row} onDelete={() => onDeleteRow(i)} />
      ))}

      <div className="row total">
        <div>Итого</div>
        <div />
        <div />
        <div />
        <div>{total}</div>
        <div />
      </div>
    </div>
  );
}
