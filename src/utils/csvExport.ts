const UTF8_BOM = '﻿';

export function isHomogeneousArray(data: unknown): boolean {
  if (!Array.isArray(data) || data.length === 0) return false;
  if (typeof data[0] !== 'object' || data[0] === null || Array.isArray(data[0])) return false;
  const keys = Object.keys(data[0]).sort().join(',');
  return data.every(
    item =>
      typeof item === 'object' &&
      item !== null &&
      !Array.isArray(item) &&
      Object.keys(item).sort().join(',') === keys
  );
}

function escapeField(value: unknown, delimiter: string): string {
  const str = value == null ? '' : String(value);
  if (str.includes(delimiter) || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCSV(data: object[], delimiter = ','): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const lines = [
    headers.map(h => escapeField(h, delimiter)).join(delimiter),
    ...data.map(row =>
      headers.map(h => escapeField((row as Record<string, unknown>)[h], delimiter)).join(delimiter)
    ),
  ];
  return UTF8_BOM + lines.join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
