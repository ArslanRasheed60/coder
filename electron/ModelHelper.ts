/**
 * ModelHelper.ts
 * Utilities for model detection, capability checks, and OpenAI request preparation.
 * Supports all GPT models (thinking/reasoning models and standard models).
 */

export interface OpenAIMessage {
  role: 'developer' | 'system' | 'user' | 'assistant';
  content: any;
}

export interface OpenAIRequestPayload {
  model: string;
  messages: OpenAIMessage[];
  max_completion_tokens?: number;
  max_tokens?: number;
  temperature?: number;
  reasoning_effort?: 'low' | 'medium' | 'high';
}

/**
 * Determines if a model is an OpenAI reasoning/thinking model (e.g., o1, o3-mini, o1-mini, o1-preview)
 */
export function isReasoningModel(model?: string): boolean {
  if (!model) return false;
  const m = model.toLowerCase().trim();
  return (
    m.startsWith('o1') ||
    m.startsWith('o3') ||
    m.startsWith('o4') ||
    m.startsWith('o-') ||
    m.includes('reasoning')
  );
}

/**
 * Checks if a specific OpenAI model supports image/vision input
 */
export function isVisionCapableOpenAIModel(model?: string): boolean {
  if (!model) return false;
  const m = model.toLowerCase().trim();

  // Known text-only OpenAI models:
  // o3-mini (text only)
  // o1-mini (text only)
  // o1-preview (text only)
  // gpt-3.5-turbo (text only)
  // base gpt-4 (without vision / turbo / 4o / 4.1 / 4.5)
  if (
    m.startsWith('o3-mini') ||
    m.startsWith('o1-mini') ||
    m.startsWith('o1-preview') ||
    m.startsWith('gpt-3.5') ||
    (m.startsWith('gpt-4') &&
      !m.includes('4o') &&
      !m.includes('4.1') &&
      !m.includes('turbo') &&
      !m.includes('vision') &&
      !m.includes('4.5'))
  ) {
    return false;
  }

  // o1 (full version), gpt-4o, gpt-4o-mini, gpt-4.5-preview, gpt-4.1, gpt-4.1-mini, chatgpt-4o-latest, gpt-4-turbo all support vision
  return true;
}

/**
 * Formats messages for OpenAI Chat Completions.
 * - For o1-preview and o1-mini, 'system' messages are rejected by OpenAI; we adapt them to user or developer instructions.
 * - For o1 and o3-mini, 'developer' message is the official supported format.
 * - For standard GPT models, 'system' is used.
 */
export function formatOpenAIMessages(
  model: string,
  systemPrompt: string,
  userContent: string | Array<any>
): OpenAIMessage[] {
  const reasoning = isReasoningModel(model);
  const m = model.toLowerCase().trim();

  // For o1-mini and o1-preview, older endpoints didn't support system/developer role at all
  if (m.startsWith('o1-mini') || m.startsWith('o1-preview')) {
    if (typeof userContent === 'string') {
      return [
        {
          role: 'user',
          content: `${systemPrompt}\n\n---\n\n${userContent}`
        }
      ];
    } else if (Array.isArray(userContent)) {
      return [
        {
          role: 'user',
          content: [
            { type: 'text', text: `[INSTRUCTIONS]: ${systemPrompt}\n\n` },
            ...userContent
          ]
        }
      ];
    }
  }

  // For o1, o3-mini, and modern reasoning models, use 'developer' role
  if (reasoning) {
    return [
      { role: 'developer', content: systemPrompt },
      { role: 'user', content: userContent }
    ];
  }

  // For standard models (gpt-4o, gpt-4.5-preview, gpt-4.1, etc.), use 'system'
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ];
}

/**
 * Builds the request options for chat.completions.create with appropriate parameter adjustments
 * for thinking vs non-thinking models.
 */
export function buildOpenAICompletionParams(options: {
  model: string;
  messages: OpenAIMessage[];
  defaultMaxTokens?: number;
  reasoningEffort?: 'low' | 'medium' | 'high';
}): OpenAIRequestPayload {
  const { model, messages, defaultMaxTokens = 4000, reasoningEffort } = options;
  const reasoning = isReasoningModel(model);

  if (reasoning) {
    // Reasoning models:
    // 1. DO NOT support temperature (OpenAI returns 400 if temperature is passed)
    // 2. MUST use max_completion_tokens (max_tokens is not supported)
    // 3. Need higher max_completion_tokens because reasoning tokens + output tokens share the budget
    const payload: OpenAIRequestPayload = {
      model,
      messages,
      max_completion_tokens: Math.max(defaultMaxTokens, 16000)
    };

    // reasoning_effort supported on o1 and o3-mini
    if (reasoningEffort && (model.startsWith('o1') || model.startsWith('o3'))) {
      payload.reasoning_effort = reasoningEffort;
    }

    return payload;
  }

  // Standard (non-thinking) models:
  return {
    model,
    messages,
    max_tokens: defaultMaxTokens,
    temperature: 0.2
  };
}
