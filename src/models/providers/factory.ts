import { OpenAICompatibleProvider, OpenAICompatibleProviderOptions } from './openai-compatible';

export function createProvider(options: OpenAICompatibleProviderOptions): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider(options);
}
