import { toCSV, isHomogeneousArray } from '../../../src/utils/csvExport';

const UTF8_BOM = '﻿';

// ─── toCSV ────────────────────────────────────────────────────────────────────

describe('toCSV', () => {
  it('genera riga di intestazione dalle chiavi del primo oggetto', () => {
    const csv = toCSV([{ nome: 'Alice', età: 30 }]);
    const lines = csv.slice(UTF8_BOM.length).split('\n');
    expect(lines[0]).toBe('nome,età');
  });

  it('genera una riga per ogni oggetto', () => {
    const data = [
      { nome: 'Alice', città: 'Roma' },
      { nome: 'Bob', città: 'Milano' },
    ];
    const csv = toCSV(data);
    const lines = csv.slice(UTF8_BOM.length).split('\n');
    expect(lines).toHaveLength(3); // header + 2 rows
    expect(lines[1]).toBe('Alice,Roma');
    expect(lines[2]).toBe('Bob,Milano');
  });

  it('escape valori con virgole tra doppi apici', () => {
    const csv = toCSV([{ nome: 'Rossi, Mario', city: 'Roma' }]);
    expect(csv).toContain('"Rossi, Mario"');
  });

  it('escape valori con newline', () => {
    const csv = toCSV([{ note: 'riga1\nriga2' }]);
    expect(csv).toContain('"riga1\nriga2"');
  });

  it('inizia con BOM UTF-8', () => {
    const csv = toCSV([{ a: 1 }]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
  });

  it('gestisce array vuoto — stringa vuota', () => {
    expect(toCSV([])).toBe('');
  });

  it('gestisce valori null come stringa vuota', () => {
    const csv = toCSV([{ nome: null as any, età: 25 }]);
    const lines = csv.slice(UTF8_BOM.length).split('\n');
    expect(lines[1]).toBe(',25');
  });
});

// ─── isHomogeneousArray ───────────────────────────────────────────────────────

describe('isHomogeneousArray', () => {
  it('true per array di oggetti con stesse chiavi', () => {
    expect(isHomogeneousArray([{ a: 1, b: 2 }, { a: 3, b: 4 }])).toBe(true);
  });

  it('false per array vuoto', () => {
    expect(isHomogeneousArray([])).toBe(false);
  });

  it('false per array di stringhe', () => {
    expect(isHomogeneousArray(['a', 'b'])).toBe(false);
  });

  it('false per oggetto singolo (non array)', () => {
    expect(isHomogeneousArray({ a: 1 })).toBe(false);
  });

  it('false per array con oggetti con chiavi diverse', () => {
    expect(isHomogeneousArray([{ a: 1 }, { b: 2 }])).toBe(false);
  });
});
