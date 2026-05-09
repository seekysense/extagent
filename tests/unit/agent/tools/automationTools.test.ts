import { jest } from '@jest/globals';
import { Recording } from '../../../../src/background/recordingManager';

// Mock RecordingManager
const mockGetRecording = jest.fn<() => Promise<Recording | null>>();

jest.mock('../../../../src/background/recordingManager', () => ({
  RecordingManager: {
    getInstance: () => ({
      getRecording: mockGetRecording,
    }),
  },
}));

import { playAutomation } from '../../../../src/agent/tools/automationTools';

const mockPage = {} as any;

const sampleRecording: Recording = {
  name: 'login-seq',
  description: 'Accesso portale',
  createdAt: '2026-05-09T10:00:00.000Z',
  steps: [
    { type: 'click', selector: '#btn-login', description: 'click su "Login"' },
    { type: 'type', selector: '[name="username"]', text: 'admin', description: 'digitato "admin" in username' },
  ],
};

describe('play_automation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lancia errore se la registrazione non esiste', async () => {
    mockGetRecording.mockResolvedValue(null);

    const tool = playAutomation(mockPage);
    const result = JSON.parse(await tool.func(JSON.stringify({ recordingName: 'missing' })));

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('Recording not found');
  });

  it('costruisce il prompt con i passi della registrazione', async () => {
    mockGetRecording.mockResolvedValue(sampleRecording);

    const tool = playAutomation(mockPage);
    const result = JSON.parse(await tool.func(JSON.stringify({ recordingName: 'login-seq' })));

    expect(result.success).toBe(true);
    expect(result.prompt).toContain('login-seq');
    expect(result.prompt).toContain('click');
    expect(result.prompt).toContain('type');
  });

  it('restituisce stepsExecuted pari al numero di step', async () => {
    mockGetRecording.mockResolvedValue(sampleRecording);

    const tool = playAutomation(mockPage);
    const result = JSON.parse(await tool.func(JSON.stringify({ recordingName: 'login-seq' })));

    expect(result.stepsExecuted).toBe(sampleRecording.steps.length);
  });
});
