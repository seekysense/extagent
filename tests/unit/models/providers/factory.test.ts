import { createProvider } from '../../../../src/models/providers/factory';
import { OpenAICompatibleProviderOptions } from '../../../../src/models/providers/openai-compatible';

jest.mock('../../../../src/models/providers/openai-compatible', () => ({
  OpenAICompatibleProvider: jest.fn().mockImplementation((opts: any) => ({
    createMessage: jest.fn(),
    getModel: jest.fn().mockReturnValue({
      id: opts.apiModelId || 'fallback-model',
      info: { name: opts.apiModelId || 'Fallback', inputPrice: 0, outputPrice: 0 },
    }),
  })),
}));

describe('createProvider', () => {
  beforeEach(() => jest.clearAllMocks());

  it('restituisce un OpenAICompatibleProvider con opzioni valide', () => {
    const options: OpenAICompatibleProviderOptions = {
      apiKey: 'test-key',
      baseUrl: 'http://localhost:8000/v1',
      apiModelId: 'qwen3-35b',
    };
    const provider = createProvider(options);
    expect(provider).toBeDefined();
    expect(provider.getModel().id).toBe('qwen3-35b');
  });

  it('usa baseUrl dalle opzioni', () => {
    const { OpenAICompatibleProvider } = require('../../../../src/models/providers/openai-compatible');
    const options: OpenAICompatibleProviderOptions = {
      apiKey: 'key',
      baseUrl: 'http://my-server/v1',
    };
    createProvider(options);
    expect(OpenAICompatibleProvider).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: 'http://my-server/v1' })
    );
  });

  it('usa apiKey dalle opzioni', () => {
    const { OpenAICompatibleProvider } = require('../../../../src/models/providers/openai-compatible');
    const options: OpenAICompatibleProviderOptions = {
      apiKey: 'my-secret-key',
      baseUrl: 'http://localhost/v1',
    };
    createProvider(options);
    expect(OpenAICompatibleProvider).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: 'my-secret-key' })
    );
  });

  it('è sincrono — non restituisce una Promise', () => {
    const options: OpenAICompatibleProviderOptions = { apiKey: 'k', baseUrl: 'http://h/v1' };
    const result = createProvider(options);
    expect(result).not.toBeInstanceOf(Promise);
  });
});
