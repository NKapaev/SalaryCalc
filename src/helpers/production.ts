import { products } from '../products';
import type { FormData, ProductionRow, ProductionByDate } from '../types';

export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function findProduct(code: string) {
  return products.find(p => p.code === code);
}

export function createProductionRow(formData: FormData): ProductionRow | null {
  const product = findProduct(formData.code);

  if (!product || formData.quantity === null) {
    return null;
  }

  return {
    code: product.code,
    name: product.name,
    price: product.price,
    quantity: formData.quantity,
    summary: product.price * formData.quantity,
  };
}

export function addProductionByDate(
  prev: ProductionByDate,
  date: Date,
  formData: FormData,
): ProductionByDate {
  const dateKey = formatDateKey(date);
  const row = createProductionRow(formData);

  if (!row) return prev;

  return {
    ...prev,
    [dateKey]: [...(prev[dateKey] ?? []), row],
  };
}

export function removeProductionRow(
  prev: ProductionByDate,
  dateKey: string,
  index: number,
): ProductionByDate {
  const dayRows = prev[dateKey];
  if (!dayRows) return prev;

  const updatedRows = dayRows.filter((_, i) => i !== index);

  if (updatedRows.length === 0) {
    const { [dateKey]: _, ...rest } = prev;
    return rest;
  }

  return {
    ...prev,
    [dateKey]: updatedRows,
  };
}

export function calculateMonthlyTotals(
  data: ProductionByDate,
): Record<string, number> {
  const result: Record<string, number> = {};

  Object.entries(data).forEach(([date, rows]) => {
    const monthKey = date.slice(0, 7); // YYYY-MM
    const dayTotal = rows.reduce((sum, r) => sum + r.summary, 0);

    result[monthKey] = (result[monthKey] ?? 0) + dayTotal;
  });

  return result;
}

export function formatDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${day}-${month}-${year}`;
}
