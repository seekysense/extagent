import { jest } from '@jest/globals';
import { SkillDefinition } from '../../../../src/agent/skillManager';

// Mock SkillManager
const mockGetSkill = jest.fn<() => Promise<SkillDefinition | null>>();

jest.mock('../../../../src/agent/skillManager', () => ({
  SkillManager: {
    getInstance: () => ({
      getSkill: mockGetSkill,
    }),
  },
}));

import { useSkill } from '../../../../src/agent/tools/skillTools';

const mockPage = {} as any;

const sampleSkill: SkillDefinition = {
  title: 'Raccolta gare',
  description: 'Estrae le gare pubbliche',
  steps: [
    { type: 'navigate', payload: 'https://portale.it/{{section}}', raw: '`navigate: https://portale.it/{{section}}`' },
    { type: 'extract', payload: '{"type":"array"}', raw: '`extract: {"type":"array"}`' },
  ],
  raw: '',
};

describe('use_skill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lancia errore se la skill non esiste', async () => {
    mockGetSkill.mockResolvedValue(null);

    const tool = useSkill(mockPage);
    const result = JSON.parse(await tool.func(JSON.stringify({ skillTitle: 'missing' })));

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('Skill not found');
  });

  it('esegue i passi in ordine', async () => {
    mockGetSkill.mockResolvedValue(sampleSkill);

    const tool = useSkill(mockPage);
    const result = JSON.parse(await tool.func(JSON.stringify({ skillTitle: 'Raccolta gare' })));

    expect(result.success).toBe(true);
    // navigate should come before extract in the prompt
    const navIdx = result.prompt.indexOf('[navigate]');
    const extIdx = result.prompt.indexOf('[extract]');
    expect(navIdx).toBeLessThan(extIdx);
  });

  it('passa i parametri ai passi che li supportano', async () => {
    mockGetSkill.mockResolvedValue(sampleSkill);

    const tool = useSkill(mockPage);
    const result = JSON.parse(
      await tool.func(JSON.stringify({ skillTitle: 'Raccolta gare', params: { section: 'gare-pubbliche' } }))
    );

    expect(result.success).toBe(true);
    expect(result.prompt).toContain('gare-pubbliche');
    expect(result.prompt).not.toContain('{{section}}');
  });

  it('restituisce stepsExecuted corretto', async () => {
    mockGetSkill.mockResolvedValue(sampleSkill);

    const tool = useSkill(mockPage);
    const result = JSON.parse(await tool.func(JSON.stringify({ skillTitle: 'Raccolta gare' })));

    expect(result.stepsExecuted).toBe(sampleSkill.steps.length);
  });
});
