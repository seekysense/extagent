import OpenAI from "openai";
import { LLMProvider, ModelInfo, ModelProfile, ProviderOptions, ApiStream } from './types';

export function isContextOverflowError(error: unknown): boolean {
  const e = error as any;
  const msg = (e?.message ?? '').toLowerCase();
  const status = e?.status ?? e?.statusCode ?? 0;
  if (status === 413 || status === 422) return true;
  if (status === 500 && (
    msg.includes('context_length') || msg.includes('too many tokens') ||
    msg.includes('maximum context') || msg.includes('request too large') ||
    msg.includes('token limit')
  )) return true;
  return false;
}

export interface OpenAICompatibleModelInfo extends ModelInfo {
  isReasoning?: boolean;
}

export interface OpenAICompatibleProviderOptions extends ProviderOptions {
  openaiCompatibleModels?: Array<{ id: string; name: string; isReasoning?: boolean; }>;
}

export class OpenAICompatibleProvider implements LLMProvider {
  static getAvailableModels(options: OpenAICompatibleProviderOptions): { id: string; name: string }[] {
    return (options.openaiCompatibleModels || []).map(m => ({ id: m.id, name: m.name }));
  }

  private options: OpenAICompatibleProviderOptions;
  private client: OpenAI;

  constructor(options: ProviderOptions) {
    this.options = options as OpenAICompatibleProviderOptions;
    this.client = new OpenAI({
      apiKey: this.options.apiKey,
      baseURL: this.options.baseUrl,
      dangerouslyAllowBrowser: true,
      timeout: 600_000, // 600s — needed for slow local LLMs
    });
  }

  getDefaultProfile(): ModelProfile | null {
    const profiles = this.options.profiles ?? [];
    if (!profiles.length) return null;
    return profiles.find(p => p.id === this.options.defaultProfileId) ?? profiles[0];
  }

  private mapTools(tools?: any[]): any[] {
    if (!tools?.length) return [];
    return tools.map(tool => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema ?? {
          type: "object",
          properties: {
            input: { type: "string", description: "The input to the tool" },
          },
          required: ["input"],
        },
      },
    }));
  }

  async *createMessage(
    systemPrompt: string,
    messages: any[],
    tools?: any[],
    profile?: ModelProfile
  ): ApiStream {
    const activeProfile = profile ?? this.getDefaultProfile();

    // Resolve model ID: profile → legacy apiModelId → fallback
    const modelId = activeProfile?.modelId ?? this.options.apiModelId ?? 'gpt-3.5-turbo';

    const filteredMessages = messages.filter(message =>
      !(message.role === "user" && typeof message.content === "string" && message.content.startsWith("[SYSTEM INSTRUCTION:"))
    );

    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...filteredMessages.map(msg => ({ role: msg.role, content: msg.content })),
    ];

    console.log("🔍 Sending messages to LLM:", JSON.stringify(openaiMessages, null, 2));
    console.log("🔍 Using model:", modelId, "| thinking:", activeProfile?.enableThinking ?? false);

    const requestBody: any = {
      model: modelId,
      messages: openaiMessages,
      stream: true,
      stream_options: { include_usage: true },
    };

    if (activeProfile?.enableThinking) {
      requestBody.enable_thinking = true;
      if (activeProfile.thinkingBudget) {
        requestBody.thinking_budget = activeProfile.thinkingBudget;
      }
      requestBody.max_completion_tokens = activeProfile.maxTokens ?? 16384;
      requestBody.temperature = 1; // required by Qwen3 reasoning mode
    } else {
      requestBody.enable_thinking = false;
      requestBody.max_tokens = activeProfile?.maxTokens ?? 4096;
      requestBody.temperature = activeProfile?.temperature ?? 0;
    }

    const mappedTools = this.mapTools(tools);
    if (mappedTools.length > 0) {
      requestBody.tools = mappedTools;
      requestBody.tool_choice = "auto";
    }

    try {
      const stream = await this.client.chat.completions.create(requestBody) as unknown as AsyncIterable<any>;
      let accumulatedToolCalls: any[] = [];

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        if (delta?.content) {
          console.log("🔍 LLM chunk:", delta.content);
          yield { type: "text", text: delta.content };
        }
        if (delta?.tool_calls) {
          console.log("🔍 LLM tool calls:", delta.tool_calls);
          for (const toolCall of delta.tool_calls) {
            const existingIndex = accumulatedToolCalls.findIndex(tc => tc.index === toolCall.index);
            if (existingIndex >= 0) {
              if (toolCall.function) {
                const existingFn = accumulatedToolCalls[existingIndex].function || {};
                accumulatedToolCalls[existingIndex].function = {
                  ...existingFn,
                  ...toolCall.function,
                  name: toolCall.function.name || existingFn.name || '',
                  arguments: (existingFn.arguments || '') + (toolCall.function.arguments || ''),
                };
              }
            } else {
              accumulatedToolCalls.push(toolCall);
            }
          }
        }
        if (chunk.usage) {
          console.log("🔍 LLM usage:", chunk.usage);
          yield {
            type: "usage",
            inputTokens: chunk.usage.prompt_tokens || 0,
            outputTokens: chunk.usage.completion_tokens || 0,
          };
        }
      }

      // Convert accumulated OpenAI tool calls back to XML format expected by ExecutionEngine
      if (accumulatedToolCalls.length > 0) {
        console.log("🔍 Emitting accumulated tool calls:", JSON.stringify(accumulatedToolCalls));
        for (const toolCall of accumulatedToolCalls) {
          const fn = toolCall.function;
          const toolName = fn?.name;
          if (fn && toolName) {
            let inputStr = fn.arguments || '';
            try {
              const parsed = JSON.parse(inputStr);
              if (parsed !== null && typeof parsed === 'object' && typeof parsed.input === 'string') {
                inputStr = parsed.input;
              }
            } catch {
              // Not JSON — use raw arguments string as-is
            }
            const toolText = `<tool>${toolName}</tool><input>${inputStr}</input><requires_approval>false</requires_approval>`;
            console.log("🔍 Converted tool call:", toolText);
            yield { type: "text", text: toolText };
          } else {
            console.warn("🔍 Skipped tool call with missing name:", JSON.stringify(toolCall));
          }
        }
      }
    } catch (error) {
      console.error("🔍 LLM API Error:", error);
      yield { type: "text", text: "Error: Failed to stream response from OpenAI-Compatible API. Please try again." };
    }
  }

  getModel(): { id: string; info: OpenAICompatibleModelInfo } {
    const defaultProfile = this.getDefaultProfile();
    if (defaultProfile) {
      return {
        id: defaultProfile.modelId,
        info: {
          name: defaultProfile.name,
          inputPrice: 0,
          outputPrice: 0,
          maxTokens: defaultProfile.maxTokens ?? 4096,
          contextWindow: defaultProfile.contextWindowSize ?? 32000,
          isReasoning: defaultProfile.enableThinking,
        },
      };
    }

    // Legacy fallback when no profiles configured
    const modelId = this.options.apiModelId;
    const models = this.options.openaiCompatibleModels || [];
    const model = models.find(m => m.id === modelId);

    if (model) {
      return {
        id: modelId!,
        info: {
          name: model.name,
          inputPrice: 0,
          outputPrice: 0,
          maxTokens: 4096,
          isReasoning: model.isReasoning,
        },
      };
    }

    if (models.length > 0) {
      const first = models[0];
      return {
        id: first.id,
        info: {
          name: first.name,
          inputPrice: 0,
          outputPrice: 0,
          maxTokens: 4096,
          isReasoning: first.isReasoning,
        },
      };
    }

    const fallbackId = modelId || 'gpt-3.5-turbo';
    return {
      id: fallbackId,
      info: {
        name: fallbackId,
        inputPrice: 0,
        outputPrice: 0,
        maxTokens: 4096,
        isReasoning: false,
      },
    };
  }
}
