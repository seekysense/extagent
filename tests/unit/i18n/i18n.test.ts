import { renderHook, waitFor } from '@testing-library/react';
import { t, getLang, useLang } from '../../../src/i18n/index';

describe('t() function', () => {
  it('restituisce la stringa italiana per chiave esistente', () => {
    expect(t('options.saved', 'it')).toBe('Impostazioni salvate!');
  });

  it('restituisce la stringa inglese quando lingua=en', () => {
    expect(t('options.saved', 'en')).toBe('Settings saved!');
  });

  it('interpola variabili nella stringa — t("...", {count:"5"})', () => {
    expect(t('memory.exportSuccess', 'it', { count: '5' })).toBe('Esportate 5 memorie con successo!');
    expect(t('memory.exportSuccess', 'en', { count: '3' })).toBe('Successfully exported 3 memories!');
  });

  it('restituisce la chiave stessa se non trovata (fallback)', () => {
    expect(t('nonexistent.key.xyz', 'it')).toBe('nonexistent.key.xyz');
  });
});

describe('useLang hook', () => {
  it('legge la lingua da chrome.storage.local', async () => {
    (chrome.storage.local.get as jest.Mock).mockResolvedValueOnce({ language: 'en' });
    const { result } = renderHook(() => useLang());

    await waitFor(() => {
      expect(result.current.lang).toBe('en');
    });
  });

  it('default a "it" se la chiave non è presente nello storage', async () => {
    (chrome.storage.local.get as jest.Mock).mockResolvedValueOnce({});
    const { result } = renderHook(() => useLang());

    await waitFor(() => {
      expect(result.current.lang).toBe('it');
    });
  });

  it('aggiorna la stringa quando chrome.storage.onChanged viene emesso', async () => {
    (chrome.storage.local.get as jest.Mock).mockResolvedValueOnce({ language: 'it' });
    const { result } = renderHook(() => useLang());

    await waitFor(() => {
      expect(result.current.lang).toBe('it');
    });

    // Capture and fire the storage change listener
    const listenerCalls = (chrome.storage.onChanged.addListener as jest.Mock).mock.calls;
    const handler = listenerCalls[listenerCalls.length - 1]?.[0];

    if (handler) {
      handler({ language: { newValue: 'en' } }, 'local');
    }

    await waitFor(() => {
      expect(result.current.lang).toBe('en');
    });
  });
});
