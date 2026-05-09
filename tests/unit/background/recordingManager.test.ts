import { jest } from '@jest/globals';
import { RecordingManager, RecordingStep } from '../../../src/background/recordingManager';
import { getSelector } from '../../../src/content/selectorUtils';

// ─── chrome.storage.local mock with in-memory backing ───────────────────────

const store: Record<string, any> = {};

beforeEach(() => {
  // Reset store and singleton between tests
  Object.keys(store).forEach(k => delete store[k]);
  (RecordingManager as any).instance = null;

  (chrome.storage.local.get as jest.Mock).mockImplementation(async (key: string) => ({
    [key]: store[key] ?? undefined,
  }));
  (chrome.storage.local.set as jest.Mock).mockImplementation(async (data: Record<string, any>) => {
    Object.assign(store, data);
  });
});

// ─── RecordingManager ───────────────────────────────────────────────────────

describe('RecordingManager', () => {
  it('startRecording crea una nuova registrazione con nome', async () => {
    const manager = RecordingManager.getInstance();
    await manager.startRecording('test-rec');
    expect(store['activeRecording']).toMatchObject({ name: 'test-rec', steps: [] });
  });

  it('stopRecording finalizza la registrazione e la salva', async () => {
    const manager = RecordingManager.getInstance();
    await manager.startRecording('final-rec');

    const step: RecordingStep = { type: 'click', selector: '#btn', description: 'click btn' };
    await manager.addStep(step);

    const recording = await manager.stopRecording('descrizione test');

    expect(recording.name).toBe('final-rec');
    expect(recording.description).toBe('descrizione test');
    expect(recording.steps).toHaveLength(1);
    expect(recording.createdAt).toBeTruthy();
    // active recording should be cleared
    expect(store['activeRecording']).toBeNull();
  });

  it('getRecording restituisce la registrazione per nome', async () => {
    const manager = RecordingManager.getInstance();
    await manager.startRecording('my-seq');
    await manager.stopRecording('desc');

    const rec = await manager.getRecording('my-seq');
    expect(rec).not.toBeNull();
    expect(rec!.name).toBe('my-seq');
  });

  it('listRecordings restituisce tutte le registrazioni salvate', async () => {
    const manager = RecordingManager.getInstance();

    await manager.startRecording('rec-a');
    await manager.stopRecording('');
    await manager.startRecording('rec-b');
    await manager.stopRecording('');

    const list = await manager.listRecordings();
    expect(list).toHaveLength(2);
    const names = list.map(r => r.name);
    expect(names).toContain('rec-a');
    expect(names).toContain('rec-b');
  });

  it('deleteRecording rimuove la registrazione e non la trova più', async () => {
    const manager = RecordingManager.getInstance();
    await manager.startRecording('to-delete');
    await manager.stopRecording('');

    await manager.deleteRecording('to-delete');

    const rec = await manager.getRecording('to-delete');
    expect(rec).toBeNull();
  });

  it('lancia errore se si avvia una registrazione già attiva', async () => {
    const manager = RecordingManager.getInstance();
    await manager.startRecording('first');
    await expect(manager.startRecording('second')).rejects.toThrow('Recording already active');
  });
});

// ─── RecordingStep selector (getSelector utility) ───────────────────────────

describe('RecordingStep selector', () => {
  it('preferisce name attribute se presente', () => {
    const el = document.createElement('input');
    el.setAttribute('name', 'username');
    expect(getSelector(el)).toBe('[name="username"]');
  });

  it('preferisce aria-label se name assente', () => {
    const el = document.createElement('button');
    el.setAttribute('aria-label', 'Submit form');
    expect(getSelector(el)).toBe('[aria-label="Submit form"]');
  });

  it('usa id come fallback', () => {
    const el = document.createElement('div');
    el.id = 'main-content';
    expect(getSelector(el)).toBe('#main-content');
  });

  it('costruisce selettore CSS path come ultimo fallback', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
    const selector = getSelector(child);
    expect(selector).toContain('span');
  });
});
