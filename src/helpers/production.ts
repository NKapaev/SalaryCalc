import { allProducts } from '../dataStorage/allProducts';
import type {
  FormData,
  ProductionByDate,
  StoredProductionRow,
  ProductionRow,
} from '../types';

import { getMonthKey } from './date';

/**
 * Оставляет только записи выбранного месяца
 */
export function filterProductionByMonth(
  data: ProductionByDate,
  month: Date,
): ProductionByDate {
  const monthKey = getMonthKey(month); // YYYY-MM

  return Object.fromEntries(
    Object.entries(data).filter(([dateKey]) => dateKey.startsWith(monthKey)),
  );
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function findProduct(code: string) {
  return allProducts.find(p => p.code === code);
}

export function enrichProductionRows(
  rows: StoredProductionRow[],
): ProductionRow[] {
  return rows
    .map(row => {
      const product = findProduct(row.code);
      if (!product) return null;

      return {
        code: row.code,
        quantity: row.quantity,
        name: product.name,
        price: product.price,
        summary: (product.price * 10 * row.quantity) / 10,
      };
    })
    .filter(Boolean) as ProductionRow[];
}

export function addProductionByDate(
  prev: ProductionByDate,
  date: Date,
  formData: FormData,
): ProductionByDate {
  if (formData.quantity == null || formData.quantity <= 0) {
    return prev;
  }

  const dateKey = formatDateKey(date);
  const quantity = formData.quantity;

  const newRow: StoredProductionRow = {
    code: formData.code,
    quantity,
  };

  const day = prev[dateKey] ?? { rows: [] };
  const index = day.rows.findIndex(r => r.code === formData.code);

  const updatedRows =
    index >= 0
      ? day.rows.map((r, i) =>
          i === index ? { ...r, quantity: r.quantity + quantity } : r,
        )
      : [...day.rows, newRow];

  return {
    ...prev,
    [dateKey]: {
      ...day,
      rows: updatedRows,
    },
  };
}

export function removeProductionRow(
  prev: ProductionByDate,
  dateKey: string,
  index: number,
): ProductionByDate {
  const day = prev[dateKey];
  if (!day) return prev;

  const updatedRows = day.rows.filter((_, i) => i !== index);

  // если удалили последнюю строку и нет комментария — удаляем день целиком
  if (updatedRows.length === 0 && !day.comment) {
    const { [dateKey]: _, ...rest } = prev;
    return rest;
  }

  return {
    ...prev,
    [dateKey]: {
      ...day,
      rows: updatedRows,
    },
  };
}

export function calculateMonthlyTotals(
  data: ProductionByDate,
): Record<string, number> {
  const result: Record<string, number> = {};

  Object.entries(data).forEach(([date, day]) => {
    const monthKey = date.slice(0, 7); // YYYY-MM

    const enriched = enrichProductionRows(day.rows);
    const dayTotal = enriched.reduce((s, r) => s + r.summary, 0);

    result[monthKey] = (result[monthKey] ?? 0) + dayTotal;
  });

  return result;
}

export function formatDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${day}-${month}-${year}`;
}

export function setDayComment(
  prev: ProductionByDate,
  dateKey: string,
  comment?: string,
): ProductionByDate {
  const day = prev[dateKey];
  if (!day) return prev;

  const trimmed = comment?.trim();

  // если нет строк И нет комментария → удалить день
  if (day.rows.length === 0 && !trimmed) {
    const { [dateKey]: _, ...rest } = prev;
    return rest;
  }

  return {
    ...prev,
    [dateKey]: {
      ...day,
      comment: trimmed || undefined,
    },
  };
}
