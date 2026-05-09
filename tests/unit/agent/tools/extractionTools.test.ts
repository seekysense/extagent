import { jest } from '@jest/globals';
import { createMockPage, mockPageContextManager } from '../../../mocks/playwright';
import type { StreamChunk } from '../../../../src/models/providers/types';

jest.mock('../../../../src/agent/PageContextManager', () => mockPageContextManager);

jest.mock('../../../../src/agent/tools/utils', () => ({
  withActivePage: jest.fn().mockImplementation((_page: any, fn: any) => fn(_page)),
  MAX_RETURN_CHARS: 20000,
}));

// Import after mocking
import { preprocessDOM, extractWithSchema, paginateAndCollect } from '../../../../src/agent/tools/extractionTools';

function makeStream(text: string) {
  return (async function* () {
    yield { type: 'text' as const, text } as StreamChunk;
  })();
}

function makeMockProvider(textOrFn: string | (() => string)) {
  return {
    createMessage: jest.fn().mockImplementation(() =>
      makeStream(typeof textOrFn === 'function' ? textOrFn() : textOrFn)
    ),
    getModel: jest.fn().mockReturnValue({ id: 'mock', info: {} }),
    getDefaultProfile: jest.fn().mockReturnValue(null),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

describe('preprocessDOM', () => {
  it('rimuove tag script e style dal DOM', () => {
    const html = '<html><body><p>Visible text</p><script>window._x=1</script><style>.a{color:red}</style></body></html>';
    const result = preprocessDOM(html);
    expect(result).not.toContain('window._x');
    expect(result).not.toContain('color:red');
    expect(result).toContain('Visible text');
  });

  it('rimuove attributi data-react-* e data-v-* ma preserva il contenuto', () => {
    const html = '<html><body><div data-react-id="1" data-v-abc="2">Content preserved</div></body></html>';
    const result = preprocessDOM(html);
    expect(result).toContain('Content preserved');
  });

  it('preserva aria-label e role (elemento non rimosso)', () => {
    const html = '<html><body><button aria-label="Submit" role="button">Click me</button></body></html>';
    const result = preprocessDOM(html);
    expect(result).toContain('Click me');
  });

  it('converte HTML a markdown leggibile', () => {
    const html = '<html><body><h1>Title</h1><p>Paragraph text.</p></body></html>';
    const result = preprocessDOM(html);
    expect(result).toContain('Title');
    expect(result).toContain('Paragraph text');
    expect(result).toContain('# Title');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('extract_with_schema', () => {
  let mockPage: any;

  beforeEach(() => {
    mockPage = createMockPage();
    jest.clearAllMocks();
  });

  it('chiama il modello con il prompt di estrazione contenente lo schema', async () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] };
    const provider = makeMockProvider(JSON.stringify({ name: 'Test' }));
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });

    const tool = extractWithSchema(mockPage, provider);
    await tool.func(JSON.stringify({ schema }));

    expect(provider.createMessage).toHaveBeenCalled();
    const callArgs = (provider.createMessage.mock.calls[0] as any[]);
    const messages = callArgs[1];
    expect(messages[0].content).toContain(JSON.stringify(schema, null, 2));
  });

  it('valida l output con ajv e lo restituisce se valido', async () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] };
    const provider = makeMockProvider(JSON.stringify({ name: 'Acme' }));
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });

    const tool = extractWithSchema(mockPage, provider);
    const result = await tool.func(JSON.stringify({ schema }));

    expect(JSON.parse(result)).toEqual({ name: 'Acme' });
    expect(provider.createMessage).toHaveBeenCalledTimes(1);
  });

  it('esegue retry con messaggio di errore se ajv fallisce', async () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] };
    const provider = {
      createMessage: jest.fn()
        .mockImplementationOnce(() => makeStream(JSON.stringify({ wrong: 'field' })))
        .mockImplementationOnce(() => makeStream(JSON.stringify({ name: 'Fixed' }))),
      getModel: jest.fn().mockReturnValue({ id: 'mock', info: {} }),
      getDefaultProfile: jest.fn().mockReturnValue(null),
    };
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });

    const tool = extractWithSchema(mockPage, provider);
    const result = await tool.func(JSON.stringify({ schema }));

    expect(provider.createMessage).toHaveBeenCalledTimes(2);
    expect(JSON.parse(result)).toEqual({ name: 'Fixed' });
  });

  it('restituisce errore dopo 2 retry falliti', async () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] };
    const provider = makeMockProvider(JSON.stringify({ wrong: 'field' }));
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });

    const tool = extractWithSchema(mockPage, provider);
    const result = await tool.func(JSON.stringify({ schema }));

    expect(provider.createMessage).toHaveBeenCalledTimes(3);
    expect(result).toContain('Error');
  });

  it('usa useAccessibilityTree=true come default', async () => {
    const schema = { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] };
    const provider = makeMockProvider(JSON.stringify({ title: 'Test' }));
    const snapshot = { role: 'WebArea', name: 'Test Page', children: [] };
    mockPage.accessibility.snapshot.mockResolvedValue(snapshot);

    const tool = extractWithSchema(mockPage, provider);
    await tool.func(JSON.stringify({ schema }));

    expect(mockPage.accessibility.snapshot).toHaveBeenCalled();
    expect(mockPage.content).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('paginate_and_collect', () => {
  let mockPage: any;

  beforeEach(() => {
    mockPage = createMockPage();
    jest.clearAllMocks();
  });

  it('chiama extract_with_schema per ogni pagina', async () => {
    const schema = { type: 'array', items: { type: 'object', properties: { id: { type: 'number' } } } };
    const provider = {
      createMessage: jest.fn()
        .mockImplementationOnce(() => makeStream(JSON.stringify([{ id: 1 }])))
        .mockImplementationOnce(() => makeStream(JSON.stringify([{ id: 2 }]))),
      getModel: jest.fn().mockReturnValue({ id: 'mock', info: {} }),
      getDefaultProfile: jest.fn().mockReturnValue(null),
    };
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });
    // First call: next button found; second call: not found
    mockPage.$.mockResolvedValueOnce({
      getAttribute: jest.fn().mockResolvedValue(null),
      click: jest.fn().mockResolvedValue(undefined),
    }).mockResolvedValueOnce(null);

    const tool = paginateAndCollect(mockPage, provider);
    const result = await tool.func(JSON.stringify({ schema, nextButtonSelector: '.next-btn', maxPages: 5 }));
    const parsed = JSON.parse(result);

    expect(parsed.pagesVisited).toBe(2);
    expect(parsed.items).toHaveLength(2);
  });

  it('si ferma quando maxPages è raggiunto', async () => {
    const schema = { type: 'array', items: { type: 'object', properties: { id: { type: 'number' } } } };
    let counter = 0;
    const provider = {
      createMessage: jest.fn().mockImplementation(() =>
        makeStream(JSON.stringify([{ id: ++counter }]))
      ),
      getModel: jest.fn().mockReturnValue({ id: 'mock', info: {} }),
      getDefaultProfile: jest.fn().mockReturnValue(null),
    };
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });
    mockPage.$.mockResolvedValue({
      getAttribute: jest.fn().mockResolvedValue(null),
      click: jest.fn().mockResolvedValue(undefined),
    });

    const tool = paginateAndCollect(mockPage, provider);
    const result = await tool.func(JSON.stringify({ schema, nextButtonSelector: '.next', maxPages: 3 }));
    const parsed = JSON.parse(result);

    expect(parsed.pagesVisited).toBe(3);
    expect(parsed.truncated).toBe(true);
  });

  it('si ferma quando il bottone non è trovato', async () => {
    const schema = { type: 'array', items: { type: 'object', properties: { id: { type: 'number' } } } };
    const provider = makeMockProvider(JSON.stringify([{ id: 1 }]));
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });
    mockPage.$.mockResolvedValue(null); // button not found

    const tool = paginateAndCollect(mockPage, provider);
    const result = await tool.func(JSON.stringify({ schema, nextButtonSelector: '.next-btn', maxPages: 10 }));
    const parsed = JSON.parse(result);

    expect(parsed.pagesVisited).toBe(1);
    expect(parsed.truncated).toBe(false);
  });

  it('deduplica per campo specificato', async () => {
    const schema = { type: 'array', items: { type: 'object', properties: { id: { type: 'number' } } } };
    const provider = {
      createMessage: jest.fn()
        .mockImplementationOnce(() => makeStream(JSON.stringify([{ id: 1 }, { id: 2 }])))
        .mockImplementationOnce(() => makeStream(JSON.stringify([{ id: 2 }, { id: 3 }]))),
      getModel: jest.fn().mockReturnValue({ id: 'mock', info: {} }),
      getDefaultProfile: jest.fn().mockReturnValue(null),
    };
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });
    mockPage.$.mockResolvedValueOnce({
      getAttribute: jest.fn().mockResolvedValue(null),
      click: jest.fn().mockResolvedValue(undefined),
    }).mockResolvedValueOnce(null);

    const tool = paginateAndCollect(mockPage, provider);
    const result = await tool.func(JSON.stringify({
      schema,
      nextButtonSelector: '.next',
      maxPages: 5,
      deduplicateField: 'id'
    }));
    const parsed = JSON.parse(result);

    expect(parsed.items).toHaveLength(3); // 1, 2, 3 — duplicate id:2 removed
  });

  it('restituisce pagesVisited e truncated=true se stoppa per maxPages', async () => {
    const schema = { type: 'array', items: { type: 'object', properties: { id: { type: 'number' } } } };
    let counter = 0;
    const provider = {
      createMessage: jest.fn().mockImplementation(() =>
        makeStream(JSON.stringify([{ id: ++counter }]))
      ),
      getModel: jest.fn().mockReturnValue({ id: 'mock', info: {} }),
      getDefaultProfile: jest.fn().mockReturnValue(null),
    };
    mockPage.accessibility.snapshot.mockResolvedValue({ role: 'WebArea', name: 'Page' });
    mockPage.$.mockResolvedValue({
      getAttribute: jest.fn().mockResolvedValue(null),
      click: jest.fn().mockResolvedValue(undefined),
    });

    const tool = paginateAndCollect(mockPage, provider);
    const result = await tool.func(JSON.stringify({ schema, nextButtonSelector: '.next', maxPages: 2 }));
    const parsed = JSON.parse(result);

    expect(parsed.pagesVisited).toBe(2);
    expect(parsed.truncated).toBe(true);
  });
});
