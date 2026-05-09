export interface ModelInfo {
  name: string;
  inputPrice: number;
  outputPrice: number;
  maxTokens?: number;
  contextWindow?: number;
  supportsImages?: boolean;
  supportsPromptCache?: boolean;
  cacheWritesPrice?: number;
  cacheReadsPrice?: number;
  isReasoningModel?: boolean;
  thinkingConfig?: {
    maxBudget?: number;
    outputPrice?: number;
  };
}

export type AgentFunction =
  | 'default'       // fallback per tutto ciò che non ha mapping esplicito
  | 'automation'    // task di automazione browser (input libero nel side panel)
  | 'skill'         // esecuzione di una skill salvata
  | 'recording'     // registrazione sequenza azioni (record & play)
  | 'smartPaste'    // Smart Paste — veloce, no thinking
  | 'smartExtract'  // Smart Extract — estrazione strutturata
  | 'observation';  // osservazione/analisi pagina senza azione

export interface FunctionMapping {
  function: AgentFunction;
  profileId: string;
}

export interface ModelProfile {
  id: string;
  name: string;
  modelId: string;
  enableThinking: boolean;
  thinkingBudget?: number;
  contextWindowSize?: number;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderOptions {
  apiKey: string;
  baseUrl?: string;
  profiles?: ModelProfile[];
  defaultProfileId?: string;
  functionMappings?: FunctionMapping[];
  dangerouslyAllowBrowser?: boolean;
  // Legacy fields — used when profiles is empty
  apiModelId?: string;
  openaiCompatibleModels?: Array<{ id: string; name: string; isReasoningModel?: boolean }>;
  thinkingBudgetTokens?: number;
}

export interface StreamChunk {
  type: "text" | "reasoning" | "usage";
  text?: string;
  reasoning?: string;
  inputTokens?: number;
  outputTokens?: number;
  cacheWriteTokens?: number;
  cacheReadTokens?: number;
}

export type ApiStream = AsyncGenerator<StreamChunk, void, unknown>;

export interface LLMProvider {
  createMessage(systemPrompt: string, messages: any[], tools?: any[], profile?: ModelProfile): ApiStream;
  getModel(): { id: string; info: ModelInfo };
  getDefaultProfile(): ModelProfile | null;
}
