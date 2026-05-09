import { jest } from '@jest/globals';
import { createMockPage, mockPageContextManager } from '../../../mocks/playwright';
import { FieldInfo, matchFields, fillFormFromData } from '../../../../src/agent/tools/formTools';

jest.mock('../../../../src/agent/PageContextManager', () => mockPageContextManager);

jest.mock('../../../../src/agent/tools/utils', () => ({
  withActivePage: jest.fn().mockImplementation((_page: any, fn: any) => fn(_page)),
  MAX_RETURN_CHARS: 20000,
}));

// ─── fixtures ────────────────────────────────────────────────────────────────

const fields: FieldInfo[] = [
  {
    tagName: 'input', type: 'text', name: 'ragione_sociale', id: '',
    label: 'Ragione Sociale', placeholder: '', selector: 'input[name="ragione_sociale"]',
  },
  {
    tagName: 'input', type: 'text', name: 'piva', id: 'piva',
    label: 'Partita IVA', placeholder: '', selector: '#piva',
  },
  {
    tagName: 'input', type: 'email', name: '', id: 'email',
    label: 'Email address', placeholder: 'Enter your email', selector: '#email',
  },
  {
    tagName: 'select', type: 'select-one', name: 'country', id: '',
    label: 'Country', placeholder: '', selector: 'select[name="country"]',
  },
  {
    tagName: 'input', type: 'hidden', name: 'csrf_token', id: '',
    label: '', placeholder: '', selector: 'input[name="csrf_token"]',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

describe('matchFields', () => {
  it('matcha per id esatto', () => {
    const { compiled, unmatched } = matchFields({ 'piva': '12345678901' }, fields);
    expect(compiled).toHaveLength(1);
    expect(compiled[0].matched_by).toBe('id');
    expect(compiled[0].field).toBe('#piva');
    expect(unmatched).toHaveLength(0);
  });

  it('matcha per name esatto', () => {
    const { compiled, unmatched } = matchFields({ 'ragione_sociale': 'Acme Srl' }, fields);
    expect(compiled).toHaveLength(1);
    expect(compiled[0].matched_by).toBe('name');
    expect(compiled[0].field).toBe('input[name="ragione_sociale"]');
    expect(unmatched).toHaveLength(0);
  });

  it('matcha per label normalizzata (case insensitive)', () => {
    const { compiled, unmatched } = matchFields({ 'email address': 'test@test.com' }, fields);
    expect(compiled).toHaveLength(1);
    expect(compiled[0].matched_by).toBe('label');
    expect(compiled[0].field).toBe('#email');
    expect(unmatched).toHaveLength(0);
  });

  it('matcha per label parziale se non c è match esatto', () => {
    // 'ragione' is a substring of label 'Ragione Sociale'
    const { compiled, unmatched } = matchFields({ 'ragione': 'Acme' }, fields);
    expect(compiled).toHaveLength(1);
    expect(compiled[0].matched_by).toBe('proximity');
    expect(unmatched).toHaveLength(0);
  });

  it('restituisce unmatched per campi senza corrispondenza', () => {
    const { compiled, unmatched } = matchFields({ 'telefono': '123456789' }, fields);
    expect(compiled).toHaveLength(0);
    expect(unmatched).toContain('telefono');
  });

  it('non matcha campi hidden', () => {
    const { compiled, unmatched } = matchFields({ 'csrf_token': 'secret-value' }, fields);
    expect(compiled).toHaveLength(0);
    expect(unmatched).toContain('csrf_token');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('fill_form_from_data output', () => {
  let mockPage: any;

  beforeEach(() => {
    mockPage = createMockPage();
    jest.clearAllMocks();
  });

  it('restituisce readyForSubmit=true se almeno un campo è compilato', async () => {
    // Scan returns two text fields
    mockPage.$$eval.mockResolvedValue([
      { tagName: 'input', type: 'text', name: 'ragione_sociale', id: '', label: 'Ragione Sociale', placeholder: '', selector: 'input[name="ragione_sociale"]' },
      { tagName: 'input', type: 'text', name: 'piva', id: '', label: 'Partita IVA', placeholder: '', selector: 'input[name="piva"]' },
    ] as FieldInfo[]);

    const tool = fillFormFromData(mockPage);
    const result = await tool.func(JSON.stringify({
      data: { ragione_sociale: 'Acme Srl', piva: '12345678901' }
    }));

    const parsed = JSON.parse(result);
    expect(parsed.readyForSubmit).toBe(true);
    expect(parsed.compiled).toHaveLength(2);
    expect(parsed.unmatched).toHaveLength(0);
  });

  it('restituisce readyForSubmit=false se unmatched include tutti i campi', async () => {
    // Scan returns one field that doesn't match the data key
    mockPage.$$eval.mockResolvedValue([
      { tagName: 'input', type: 'text', name: 'nome', id: '', label: 'Nome', placeholder: '', selector: 'input[name="nome"]' },
    ] as FieldInfo[]);

    const tool = fillFormFromData(mockPage);
    const result = await tool.func(JSON.stringify({
      data: { telefono: '123456789', email: 'test@test.com' }
    }));

    const parsed = JSON.parse(result);
    expect(parsed.readyForSubmit).toBe(false);
    expect(parsed.compiled).toHaveLength(0);
    expect(parsed.unmatched).toHaveLength(2);
  });

  it('non modifica il DOM se tutti i campi sono unmatched', async () => {
    mockPage.$$eval.mockResolvedValue([
      { tagName: 'input', type: 'text', name: 'nome', id: '', label: 'Nome', placeholder: '', selector: 'input[name="nome"]' },
    ] as FieldInfo[]);

    const tool = fillFormFromData(mockPage);
    await tool.func(JSON.stringify({ data: { indirizzo: 'Via Roma 1' } }));

    expect(mockPage.fill).not.toHaveBeenCalled();
    expect(mockPage.check).not.toHaveBeenCalled();
    expect(mockPage.selectOption).not.toHaveBeenCalled();
  });
});
