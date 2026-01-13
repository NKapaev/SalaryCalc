import styles from './row.module.css';

import type { ProductionRow } from '../../types';

interface RowProps {
  row: ProductionRow;
  onDelete: () => void;
}

export default function Row({ row, onDelete }: RowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.cell}>{row.code}</div>
      <div className={`${styles.cell} ${styles.nameCell}`}>{row.name}</div>
      <div className={styles.cell}>{row.price}</div>
      <div className={styles.cell}>{row.quantity}</div>
      <div className={styles.cell}>{row.summary}</div>
      <button className={styles.deleteButton} onClick={onDelete}>
        ❌
      </button>
    </div>
  );
}
