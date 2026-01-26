import styles from './dayTable.module.css';

import Row from '../row/Row';
import { useState } from 'react';
import { formatDisplayDate } from '../../helpers/production';
// import type { StoredProductionRow } from '../../types';
import { enrichProductionRows } from '../../helpers/production';
import type { DayProduction } from '../../types';

interface DayTableProps {
  date: string;
  day: DayProduction;
  onDeleteRow: (index: number) => void;
  onSetComment: (comment?: string) => void;
}

export default function DayTable({
  date,
  day,
  onDeleteRow,
  onSetComment,
}: DayTableProps) {
  const [commentEdit, setCommentEdit] = useState<boolean>(false);
  const displayRows = enrichProductionRows(day.rows);
  const dayTotal = displayRows.reduce((s, r) => s + r.summary, 0);

  return (
    <div className={styles.dayTable}>
      <h3>{formatDisplayDate(date)}</h3>
      {/* {day.comment && <p className={styles.comment}>💬 {day.comment}</p>} */}
      <div className={styles.commentContainer}>
        <button
          className={styles.commentButton}
          onClick={() => {
            setCommentEdit(!commentEdit);
          }}
        >
          💬
        </button>
        {commentEdit ? (
          <textarea
            className={styles.commentTextarea}
            placeholder="Комментарий к дню"
            defaultValue={day.comment ?? ''}
            onBlur={e => onSetComment(e.target.value.trim() || undefined)}
          />
        ) : (
          day.comment && <p className={styles.comment}>{day.comment}</p>
        )}
      </div>
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
      <div className={`${styles.row} ${styles.total}`}>
        <div>
          <pre className={styles.pre}>Итого: </pre>
        </div>
        <div />
        <div />
        <div />
        <div>{dayTotal}</div>
        <div />
      </div>
    </div>
  );
}
