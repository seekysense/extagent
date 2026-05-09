import { OpenAICompatibleProvider, OpenAICompatibleProviderOptions, isContextOverflowError } from '../../../../src/models/providers/openai-compatible';
import { ModelProfile } from '../../../../src/models/providers/types';

let capturedRequestBody: any = null;

jest.mock('openai', () => {
  const MockOpenAI = jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockImplementation(async (body: any) => {
          capturedRequestBody = body;
          return (async function* () {})();
        }),
      },
    },
  }));
  return { __esModule: true, default: MockOpenAI };
});

const baseOptions: OpenAICompatibleProviderOptions = {
  apiKey: 'test-key',
  baseUrl: 'http://localhost:8000/v1',
  apiModelId: 'qwen3-35b',
  openaiCompatibleModels: [
    { id: 'qwen3-35b', name: 'Qwen3 35B' },
    { id: 'qwen3-7b', name: 'Qwen3 7B' },
  ],
};

const thinkingProfile: ModelProfile = {
  id: 'thinking',
  name: 'Qwen3 Thinking',
  modelId: 'qwen3-35b',
  enableThinking: true,
  thinkingBudget: 8192,
  maxTokens: 16384,
  temperature: 0.5, // should be overridden to 1
};

const fastProfile: ModelProfile = {
  id: 'fast',
  name: 'Qwen3 Fast',
  modelId: 'qwen3-35b',
  enableThinking: false,
  maxTokens: 4096,
  temperature: 0,
};

async function drainStream(stream: AsyncIterable<any>) {
  for await (const _ of stream) { /* drain */ }
}

describe('OpenAICompatibleProvider - enable_thinking nel body', () => {
  beforeEach(() => { capturedRequestBody = null; });

  it('include enable_thinking=true nel body quando profile.enableThinking=true', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], [], thinkingProfile));
    expect(capturedRequestBody.enable_thinking).toBe(true);
  });

  it('include enable_thinking=false nel body quando profile.enableThinking=false', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], [], fastProfile));
    expect(capturedRequestBody.enable_thinking).toBe(false);
  });

  it('forza temperature=1 quando enableThinking=true (indipendente dal profilo)', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], [], thinkingProfile));
    expect(capturedRequestBody.temperature).toBe(1);
  });

  it('usa la temperature del profilo quando enableThinking=false', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], [], fastProfile));
    expect(capturedRequestBody.temperature).toBe(0);
  });

  it('usa max_completion_tokens quando enableThinking=true', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], [], thinkingProfile));
    expect(capturedRequestBody.max_completion_tokens).toBe(16384);
    expect(capturedRequestBody.max_tokens).toBeUndefined();
  });

  it('usa max_tokens quando enableThinking=false', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], [], fastProfile));
    expect(capturedRequestBody.max_tokens).toBe(4096);
    expect(capturedRequestBody.max_completion_tokens).toBeUndefined();
  });

  it('include thinking_budget se profile.thinkingBudget è definito', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], [], thinkingProfile));
    expect(capturedRequestBody.thinking_budget).toBe(8192);
  });

  it('non include thinking_budget se profile.thinkingBudget non è definito', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    const profileNobudget: ModelProfile = { ...thinkingProfile, thinkingBudget: undefined };
    await drainStream(provider.createMessage('sys', [], [], profileNobudget));
    expect(capturedRequestBody.thinking_budget).toBeUndefined();
  });
});

describe('OpenAICompatibleProvider - tool schema', () => {
  beforeEach(() => { capturedRequestBody = null; });

  it('mappa tool con il loro inputSchema reale', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    const tools = [{
      name: 'browser_click',
      description: 'Click on an element',
      inputSchema: {
        type: 'object',
        properties: { selector: { type: 'string' } },
        required: ['selector'],
      },
    }];
    await drainStream(provider.createMessage('sys', [], tools, fastProfile));
    expect(capturedRequestBody.tools[0].function.parameters.properties.selector).toBeDefined();
    expect(capturedRequestBody.tools[0].function.parameters.properties.input).toBeUndefined();
  });

  it('usa fallback {input:string} se inputSchema non presente', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    const tools = [{ name: 'my_tool', description: 'A tool' }];
    await drainStream(provider.createMessage('sys', [], tools, fastProfile));
    expect(capturedRequestBody.tools[0].function.parameters.properties.input).toBeDefined();
  });

  it('include name e description del tool', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    const tools = [{ name: 'browser_screenshot', description: 'Take a screenshot' }];
    await drainStream(provider.createMessage('sys', [], tools, fastProfile));
    expect(capturedRequestBody.tools[0].function.name).toBe('browser_screenshot');
    expect(capturedRequestBody.tools[0].function.description).toBe('Take a screenshot');
  });

  it('restituisce array vuoto se tools non forniti', async () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    await drainStream(provider.createMessage('sys', [], undefined, fastProfile));
    expect(capturedRequestBody.tools).toBeUndefined();
  });
});

describe('OpenAICompatibleProvider - getDefaultProfile()', () => {
  it('restituisce il profilo con id=defaultProfileId', () => {
    const provider = new OpenAICompatibleProvider({
      ...baseOptions,
      profiles: [thinkingProfile, fastProfile],
      defaultProfileId: 'fast',
    });
    expect(provider.getDefaultProfile()?.id).toBe('fast');
  });

  it('restituisce il primo profilo se defaultProfileId non matcha', () => {
    const provider = new OpenAICompatibleProvider({
      ...baseOptions,
      profiles: [thinkingProfile, fastProfile],
      defaultProfileId: 'non-existent',
    });
    expect(provider.getDefaultProfile()?.id).toBe('thinking');
  });

  it('restituisce null se profiles è vuoto', () => {
    const provider = new OpenAICompatibleProvider({ ...baseOptions, profiles: [] });
    expect(provider.getDefaultProfile()).toBeNull();
  });
});

describe('OpenAICompatibleProvider - getModel()', () => {
  it('restituisce dati dal profilo default quando profiles configurati', () => {
    const provider = new OpenAICompatibleProvider({
      ...baseOptions,
      profiles: [thinkingProfile],
      defaultProfileId: 'thinking',
    });
    const model = provider.getModel();
    expect(model.id).toBe('qwen3-35b');
    expect(model.info.name).toBe('Qwen3 Thinking');
  });

  it('restituisce il modello configurato tramite apiModelId (legacy)', () => {
    const provider = new OpenAICompatibleProvider(baseOptions);
    const model = provider.getModel();
    expect(model.id).toBe('qwen3-35b');
    expect(model.info.name).toBe('Qwen3 35B');
  });

  it('fallback al primo modello se apiModelId non matcha (legacy)', () => {
    const provider = new OpenAICompatibleProvider({ ...baseOptions, apiModelId: 'non-existent-model' });
    const model = provider.getModel();
    expect(model.id).toBe('qwen3-35b');
  });

  it('usa fallback id se openaiCompatibleModels è vuoto (legacy)', () => {
    const provider = new OpenAICompatibleProvider({ ...baseOptions, apiModelId: 'my-custom-model', openaiCompatibleModels: [] });
    const model = provider.getModel();
    expect(model.id).toBe('my-custom-model');
  });

  it('usa gpt-3.5-turbo come fallback se nessun modello e nessun apiModelId', () => {
    const provider = new OpenAICompatibleProvider({ ...baseOptions, apiModelId: undefined, openaiCompatibleModels: [] });
    const model = provider.getModel();
    expect(model.id).toBe('gpt-3.5-turbo');
  });
});

describe('isContextOverflowError', () => {
  it('ritorna true per status 413', () => {
    expect(isContextOverflowError({ status: 413, message: 'Payload Too Large' })).toBe(true);
  });

  it('ritorna true per status 422', () => {
    expect(isContextOverflowError({ status: 422, message: 'Unprocessable Entity' })).toBe(true);
  });

  it('ritorna true per status 500 con messaggio context_length', () => {
    expect(isContextOverflowError({ status: 500, message: 'context_length exceeded' })).toBe(true);
  });

  it('ritorna true per status 500 con messaggio too many tokens', () => {
    expect(isContextOverflowError({ status: 500, message: 'too many tokens in request' })).toBe(true);
  });

  it('ritorna false per status 500 senza parole chiave', () => {
    expect(isContextOverflowError({ status: 500, message: 'Internal Server Error' })).toBe(false);
  });

  it('ritorna false per errore generico senza status', () => {
    expect(isContextOverflowError(new Error('Network error'))).toBe(false);
  });
});
