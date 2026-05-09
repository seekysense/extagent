import { jest } from '@jest/globals';
import { parseSkill, SkillManager, SkillDefinition } from '../../../src/agent/skillManager';

// ─── chrome.storage.local in-memory mock ─────────────────────────────────────

const store: Record<string, any> = {};

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  (SkillManager as any).instance = null;

  (chrome.storage.local.get as jest.Mock).mockImplementation(async (key: string) => ({
    [key]: store[key] ?? undefined,
  }));
  (chrome.storage.local.set as jest.Mock).mockImplementation(async (data: Record<string, any>) => {
    Object.assign(store, data);
  });
});

// ─── Sample skill markdown ────────────────────────────────────────────────────

const SAMPLE_MD = `---
title: Raccolta gare
description: Estrae le gare pubbliche dalla pagina
---

## Passi

1. Naviga alla lista gare
   - \`navigate: https://portale.comune.it/gare\`

2. Estrai le gare
   - \`extract: {"type":"array","items":{"type":"object"}}\`

3. Raccogli più pagine
   - \`paginate: {maxPages: 5}\`

4. Riproduci la sequenza login
   - \`play: login-seq\`
`;

// ─── parseSkill ───────────────────────────────────────────────────────────────

describe('parseSkill', () => {
  it('estrae title e description dal frontmatter YAML', () => {
    const skill = parseSkill(SAMPLE_MD);
    expect(skill.title).toBe('Raccolta gare');
    expect(skill.description).toBe('Estrae le gare pubbliche dalla pagina');
  });

  it('parsa passi con comando navigate', () => {
    const skill = parseSkill(SAMPLE_MD);
    const nav = skill.steps.find(s => s.type === 'navigate');
    expect(nav).toBeDefined();
    expect(nav!.payload).toBe('https://portale.comune.it/gare');
  });

  it('parsa passi con comando extract e schema JSON', () => {
    const skill = parseSkill(SAMPLE_MD);
    const ext = skill.steps.find(s => s.type === 'extract');
    expect(ext).toBeDefined();
    expect(ext!.payload).toContain('"type":"array"');
  });

  it('parsa passi con comando paginate', () => {
    const skill = parseSkill(SAMPLE_MD);
    const pag = skill.steps.find(s => s.type === 'paginate');
    expect(pag).toBeDefined();
    expect(pag!.payload).toContain('maxPages');
  });

  it('parsa passi con comando play e nome registrazione', () => {
    const skill = parseSkill(SAMPLE_MD);
    const play = skill.steps.find(s => s.type === 'play');
    expect(play).toBeDefined();
    expect(play!.payload).toBe('login-seq');
  });

  it('ignora righe senza comando speciale (testo libero)', () => {
    const skill = parseSkill(SAMPLE_MD);
    // Only 4 special commands, no text steps
    expect(skill.steps.every(s => s.type !== 'text' as any)).toBe(true);
    expect(skill.steps).toHaveLength(4);
  });

  it('lancia errore se frontmatter mancante', () => {
    expect(() => parseSkill('## Solo testo\nSenza frontmatter')).toThrow('Missing frontmatter');
  });
});

// ─── SkillManager CRUD ────────────────────────────────────────────────────────

describe('SkillManager CRUD', () => {
  const sampleSkill: SkillDefinition = {
    title: 'Test skill',
    description: 'Una skill di test',
    steps: [{ type: 'navigate', payload: 'https://example.com', raw: '`navigate: https://example.com`' }],
    raw: '---\ntitle: Test skill\ndescription: Una skill di test\n---\n\n`navigate: https://example.com`',
  };

  it('saveSkill salva la skill nello storage', async () => {
    const manager = SkillManager.getInstance();
    await manager.saveSkill(sampleSkill);
    expect(store['skills']).toBeDefined();
    expect(store['skills']['Test skill']).toMatchObject({ title: 'Test skill' });
  });

  it('getSkill restituisce la skill per titolo', async () => {
    const manager = SkillManager.getInstance();
    await manager.saveSkill(sampleSkill);
    const retrieved = await manager.getSkill('Test skill');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.title).toBe('Test skill');
  });

  it('listSkills restituisce tutte le skill', async () => {
    const manager = SkillManager.getInstance();
    await manager.saveSkill(sampleSkill);
    await manager.saveSkill({ ...sampleSkill, title: 'Second skill' });
    const list = await manager.listSkills();
    expect(list).toHaveLength(2);
    expect(list.map(s => s.title)).toContain('Test skill');
    expect(list.map(s => s.title)).toContain('Second skill');
  });

  it('deleteSkill rimuove la skill', async () => {
    const manager = SkillManager.getInstance();
    await manager.saveSkill(sampleSkill);
    await manager.deleteSkill('Test skill');
    const retrieved = await manager.getSkill('Test skill');
    expect(retrieved).toBeNull();
  });

  it('importFromFile parsa il markdown e salva la skill', async () => {
    const manager = SkillManager.getInstance();
    const skill = await manager.importFromFile(SAMPLE_MD);
    expect(skill.title).toBe('Raccolta gare');
    expect(skill.steps).toHaveLength(4);
    const saved = await manager.getSkill('Raccolta gare');
    expect(saved).not.toBeNull();
  });
});
