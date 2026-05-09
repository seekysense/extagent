import { jest } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React from 'react';

jest.mock('../../../src/i18n', () => ({
  useLang: () => ({ t: (key: string) => key, lang: 'it' }),
}));

import { ResultDisplay } from '../../../src/sidepanel/components/ResultDisplay';
import { useTaskHistory } from '../../../src/sidepanel/hooks/useTaskHistory';

// ─── ResultDisplay ────────────────────────────────────────────────────────────

const homogeneous = [
  { nome: 'Alice', città: 'Roma', piva: '01234567890' },
  { nome: 'Bob', città: 'Milano', piva: '09876543210' },
];

describe('ResultDisplay', () => {
  it('mostra tabella per array omogeneo', () => {
    render(<ResultDisplay result={homogeneous} />);
    expect(screen.getByTestId('result-table')).toBeInTheDocument();
  });

  it('mostra JSON pre-formattato per oggetto singolo', () => {
    render(<ResultDisplay result={{ key: 'value' }} />);
    expect(screen.getByTestId('result-json')).toBeInTheDocument();
  });

  it('mostra JSON per array non omogeneo', () => {
    render(<ResultDisplay result={[{ a: 1 }, { b: 2 }]} />);
    expect(screen.getByTestId('result-json')).toBeInTheDocument();
  });

  it('tabella ha intestazioni corrette', () => {
    render(<ResultDisplay result={homogeneous} />);
    expect(screen.getByText('nome')).toBeInTheDocument();
    expect(screen.getByText('città')).toBeInTheDocument();
    expect(screen.getByText('piva')).toBeInTheDocument();
  });
});

// ─── useTaskHistory ───────────────────────────────────────────────────────────

describe('useTaskHistory', () => {
  it('addTask aggiunge un task alla lista', () => {
    const { result } = renderHook(() => useTaskHistory());
    act(() => {
      result.current.addTask('cerca prezzi online');
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].prompt).toBe('cerca prezzi online');
  });

  it('clearHistory svuota la lista', () => {
    const { result } = renderHook(() => useTaskHistory());
    act(() => {
      result.current.addTask('task 1');
      result.current.addTask('task 2');
    });
    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.history).toHaveLength(0);
  });

  it('getHistory restituisce i task in ordine cronologico', () => {
    const { result } = renderHook(() => useTaskHistory());
    act(() => {
      result.current.addTask('primo');
      result.current.addTask('secondo');
    });
    const h = result.current.getHistory();
    expect(h[0].prompt).toBe('primo');
    expect(h[1].prompt).toBe('secondo');
  });
});
