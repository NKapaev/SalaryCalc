// ключ месяца в формате YYYY-MM
export function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// первый день месяца
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// сдвиг месяца (для стрелок ◀ ▶)
export function addMonths(date: Date, offset: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

// заголовок месяца для UI
export function formatMonthTitle(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });
}
