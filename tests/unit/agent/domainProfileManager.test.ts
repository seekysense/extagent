import { jest } from '@jest/globals';
import { globToRegex, matchProfile, DomainProfileManager, DomainProfile } from '../../../src/agent/domainProfileManager';

// ─── chrome.storage.local in-memory mock ─────────────────────────────────────

const store: Record<string, any> = {};

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  (DomainProfileManager as any).instance = null;

  (chrome.storage.local.get as jest.Mock).mockImplementation(async (key: string) => ({
    [key]: store[key] ?? undefined,
  }));
  (chrome.storage.local.set as jest.Mock).mockImplementation(async (data: Record<string, any>) => {
    Object.assign(store, data);
  });
});

// ─── globToRegex ──────────────────────────────────────────────────────────────

describe('globToRegex', () => {
  it('*.acme.it matcha www.acme.it', () => {
    expect(globToRegex('*.acme.it').test('www.acme.it')).toBe(true);
  });

  it('*.acme.it non matcha www.acme.it.evil.com', () => {
    expect(globToRegex('*.acme.it').test('www.acme.it.evil.com')).toBe(false);
  });

  it('gestionale.acme.it/fornitori* matcha gestionale.acme.it/fornitori/lista', () => {
    expect(globToRegex('gestionale.acme.it/fornitori*').test('gestionale.acme.it/fornitori/lista')).toBe(true);
  });

  it('** matcha path con slash', () => {
    expect(globToRegex('**.acme.it').test('portale.comune.milan.it/appalti')).toBe(false);
    expect(globToRegex('*.comune.**/appalti').test('portale.comune.milan.it/appalti')).toBe(true);
  });

  it('pattern senza wildcard matcha solo URL esatto', () => {
    expect(globToRegex('gestionale.acme.it').test('gestionale.acme.it')).toBe(true);
    expect(globToRegex('gestionale.acme.it').test('altro.acme.it')).toBe(false);
  });
});

// ─── matchProfile ─────────────────────────────────────────────────────────────

const profiles: DomainProfile[] = [
  { id: '1', display_name: 'ACME', domain_pattern: '*.acme.it', enabled: true },
  { id: '2', display_name: 'Comune', domain_pattern: '*.comune.*/appalti', enabled: true },
  { id: '3', display_name: 'Disabled', domain_pattern: '*.disabled.it', enabled: false },
];

describe('matchProfile', () => {
  it('restituisce il profilo corretto per URL matchante', () => {
    const result = matchProfile('https://www.acme.it/page', profiles);
    expect(result).not.toBeNull();
    expect(result!.display_name).toBe('ACME');
  });

  it('restituisce null se nessun profilo matcha', () => {
    expect(matchProfile('https://www.other.com/page', profiles)).toBeNull();
  });

  it('restituisce il primo profilo in ordine se più pattern matchano', () => {
    const multi: DomainProfile[] = [
      { id: 'a', display_name: 'First', domain_pattern: '*.acme.it', enabled: true },
      { id: 'b', display_name: 'Second', domain_pattern: 'portale.acme.it', enabled: true },
    ];
    const result = matchProfile('https://portale.acme.it/', multi);
    expect(result!.display_name).toBe('First');
  });

  it('ignora profili con enabled=false', () => {
    const result = matchProfile('https://portale.disabled.it/', profiles);
    expect(result).toBeNull();
  });
});

// ─── DomainProfileManager CRUD ────────────────────────────────────────────────

const sampleProfile: DomainProfile = {
  id: 'test-001',
  display_name: 'Test Portal',
  domain_pattern: '*.test.it',
  system_prompt_addendum: 'Use the test portal specific selectors.',
  enabled: true,
};

describe('DomainProfileManager CRUD', () => {
  it('saveProfile salva nello storage', async () => {
    const manager = DomainProfileManager.getInstance();
    await manager.saveProfile(sampleProfile);
    expect(store['domainProfiles']).toBeDefined();
    expect(store['domainProfiles'][0]).toMatchObject({ id: 'test-001' });
  });

  it('getProfile restituisce per id', async () => {
    const manager = DomainProfileManager.getInstance();
    await manager.saveProfile(sampleProfile);
    const retrieved = await manager.getProfile('test-001');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.display_name).toBe('Test Portal');
  });

  it('listProfiles restituisce tutti i profili', async () => {
    const manager = DomainProfileManager.getInstance();
    await manager.saveProfile(sampleProfile);
    await manager.saveProfile({ ...sampleProfile, id: 'test-002', display_name: 'Second Portal' });
    const list = await manager.listProfiles();
    expect(list).toHaveLength(2);
    expect(list.map(p => p.id)).toContain('test-001');
    expect(list.map(p => p.id)).toContain('test-002');
  });

  it('deleteProfile rimuove dallo storage', async () => {
    const manager = DomainProfileManager.getInstance();
    await manager.saveProfile(sampleProfile);
    await manager.deleteProfile('test-001');
    const retrieved = await manager.getProfile('test-001');
    expect(retrieved).toBeNull();
  });
});
