import styles from './dayTable.module.css';

import Row from '../row/Row';
import { formatDisplayDate } from '../../helpers/production';
import type { StoredProductionRow } from '../../types';
import { enrichProductionRows } from '../../helpers/production';

interface DayTableProps {
  date: string;
  rows: StoredProductionRow[];
  onDeleteRow: (index: number) => void;
}

export default function DayTable({ date, rows, onDeleteRow }: DayTableProps) {
  const displayRows = enrichProductionRows(rows);

  const enriched = enrichProductionRows(rows);
  const dayTotal = enriched.reduce((s, r) => s + r.summary, 0);

  return (
    <div className="day-table">
      <h3>{formatDisplayDate(date)}</h3>

      <div className={`${styles.row} ${styles.header}`}>
        <div className={styles.cell}>Код</div>
        <div className={`${styles.cell} ${styles.nameCell}`}>Название</div>
        <div className={styles.cell}>Цена</div>
        <div className={styles.cell}>Кол-во</div>
        <div className={styles.cell}>Сумма</div>
        <div />
      </div>

      {displayRows.map((row, i) => (
        <Row key={row.code} row={row} onDelete={() => onDeleteRow(i)} />
      ))}

      <div className="row total">
        <div>Итого</div>
        <div />
        <div />
        <div />
        <div>{dayTotal}</div>
        <div />
      </div>
    </div>
  );
}
