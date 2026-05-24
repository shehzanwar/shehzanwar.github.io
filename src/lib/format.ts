// src/lib/format.ts

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

export function formatMonthYear(date: Date | string): string {
  return monthYearFormatter.format(new Date(date));
}

export function formatDateRange(
  start: Date | string,
  end: Date | string | null,
): string {
  const startStr = formatMonthYear(start);
  const endStr = end ? formatMonthYear(end) : 'Present';
  return `${startStr} – ${endStr}`;
}
