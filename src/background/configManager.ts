import { OpenAICompatibleProvider } from '../models/providers/openai-compatible';
import { AgentFunction, FunctionMapping, ModelProfile } from '../models/providers/types';

export interface ProviderConfig {
  provider: 'openai-compatible';
  apiKey: string;
  apiModelId?: string;
  baseUrl?: string;
  openaiCompatibleModels?: Array<{ id: string; name: string; isReasoningModel?: boolean }>;
}

export interface TestConnectionResult {
  ok: boolean;
  error?: string;
}

export class ConfigManager {
  private static instance: ConfigManager;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async getProviderConfig(): Promise<ProviderConfig> {
    const result = await chrome.storage.sync.get({
      openaiCompatibleApiKey: '',
      openaiCompatibleModelId: '',
      openaiCompatibleBaseUrl: '',
      openaiCompatibleModels: [],
    });

    return {
      provider: 'openai-compatible',
      apiKey: result.openaiCompatibleApiKey,
      apiModelId: result.openaiCompatibleModelId,
      baseUrl: result.openaiCompatibleBaseUrl,
      openaiCompatibleModels: result.openaiCompatibleModels || [],
    };
  }

  async saveProviderConfig(config: Partial<ProviderConfig>): Promise<void> {
    await chrome.storage.sync.set(config);
  }

  async getConfiguredProviders(): Promise<string[]> {
    const result = await chrome.storage.sync.get({
      openaiCompatibleApiKey: '',
      openaiCompatibleBaseUrl: '',
    });

    if (result.openaiCompatibleApiKey || result.openaiCompatibleBaseUrl) {
      return ['openai-compatible'];
    }
    return [];
  }

  async getModelsForProvider(provider: string): Promise<{ id: string; name: string }[]> {
    if (provider !== 'openai-compatible') return [];
    const result = await chrome.storage.sync.get({ openaiCompatibleModels: [] });
    return OpenAICompatibleProvider.getAvailableModels({
      openaiCompatibleModels: result.openaiCompatibleModels || [],
    } as any);
  }

  async updateProviderAndModel(_provider: string, modelId: string): Promise<void> {
    await chrome.storage.sync.set({
      openaiCompatibleModelId: modelId,
    });
  }

  // ── Model Profiles ────────────────────────────────────────────────────────

  async getProfiles(): Promise<ModelProfile[]> {
    const result = await chrome.storage.sync.get({ modelProfiles: [] });
    return result.modelProfiles || [];
  }

  async saveProfiles(profiles: ModelProfile[]): Promise<void> {
    await chrome.storage.sync.set({ modelProfiles: profiles });
  }

  async getDefaultProfileId(): Promise<string> {
    const result = await chrome.storage.sync.get({ defaultProfileId: '' });
    return result.defaultProfileId || '';
  }

  async setDefaultProfileId(id: string): Promise<void> {
    await chrome.storage.sync.set({ defaultProfileId: id });
  }

  async getActiveProfile(): Promise<ModelProfile | null> {
    const [profiles, defaultId] = await Promise.all([
      this.getProfiles(),
      this.getDefaultProfileId(),
    ]);
    if (!profiles.length) return null;
    return profiles.find(p => p.id === defaultId) ?? profiles[0];
  }

  // ── Function → Profile Routing ───────────────────────────────────────────

  async getFunctionMappings(): Promise<FunctionMapping[]> {
    const result = await chrome.storage.sync.get({ functionMappings: [] });
    return result.functionMappings || [];
  }

  async setFunctionMapping(fn: AgentFunction, profileId: string): Promise<void> {
    const mappings = await this.getFunctionMappings();
    const idx = mappings.findIndex(m => m.function === fn);
    if (idx >= 0) {
      mappings[idx] = { function: fn, profileId };
    } else {
      mappings.push({ function: fn, profileId });
    }
    await chrome.storage.sync.set({ functionMappings: mappings });
  }

  async resolveProfileForFunction(fn: AgentFunction): Promise<ModelProfile | null> {
    const [mappings, profiles] = await Promise.all([
      this.getFunctionMappings(),
      this.getProfiles(),
    ]);
    const mapping = mappings.find(m => m.function === fn);
    if (mapping) {
      const profile = profiles.find(p => p.id === mapping.profileId);
      if (profile) return profile;
    }
    // Fallback: active (default) profile
    return this.getActiveProfile();
  }

  // ── Memory ────────────────────────────────────────────────────────────────

  async getMemoryEnabled(): Promise<boolean> {
    const result = await chrome.storage.sync.get({ memoryEnabled: true });
    return result.memoryEnabled !== false;
  }

  async setMemoryEnabled(enabled: boolean): Promise<void> {
    await chrome.storage.sync.set({ memoryEnabled: enabled });
  }

  // ── Custom System Prompt ─────────────────────────────────────────────────

  async getCustomSystemPrompt(): Promise<string> {
    const result = await chrome.storage.local.get({ customSystemPrompt: '' });
    return result.customSystemPrompt || '';
  }

  async setCustomSystemPrompt(prompt: string): Promise<void> {
    await chrome.storage.local.set({ customSystemPrompt: prompt });
  }

  // ── Tool Timeouts ─────────────────────────────────────────────────────────

  async getToolTimeoutMs(): Promise<number> {
    const result = await chrome.storage.sync.get({ toolTimeoutMs: 600_000 });
    return result.toolTimeoutMs || 600_000;
  }

  async getNavigationTimeoutMs(): Promise<number> {
    const result = await chrome.storage.sync.get({ navigationTimeoutMs: 600_000 });
    return result.navigationTimeoutMs || 600_000;
  }

  // ── Test Connection ───────────────────────────────────────────────────────

  async testConnection(
    baseUrl: string,
    apiKey: string,
    modelId: string
  ): Promise<TestConnectionResult> {
    const url = baseUrl.replace(/\/$/, '') + '/chat/completions';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 1,
          stream: false,
        }),
      });

      if (response.status >= 500) {
        const text = await response.text().catch(() => '');
        return { ok: false, error: `Server error ${response.status}: ${text.slice(0, 200)}` };
      }

      // 2xx or 4xx (model error, auth error) still means the server is reachable
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
