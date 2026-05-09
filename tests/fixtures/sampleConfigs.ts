import { ProviderConfig } from '../../src/background/configManager';

export const mockOpenAICompatibleConfig: ProviderConfig = {
  provider: 'openai-compatible',
  apiKey: 'test-compatible-key',
  apiModelId: 'qwen3-35b',
  baseUrl: 'http://localhost:8000/v1',
  openaiCompatibleModels: [
    { id: 'qwen3-35b', name: 'Qwen3 35B' },
  ],
};

export const mockOpenAICompatibleConfigNoKey: ProviderConfig = {
  provider: 'openai-compatible',
  apiKey: '',
  apiModelId: 'qwen3-35b',
  baseUrl: 'http://localhost:8000/v1',
  openaiCompatibleModels: [],
};

export const allConfigs = [mockOpenAICompatibleConfig];
