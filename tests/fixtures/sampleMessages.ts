type Message = { role: string; content: string | any };

export const sampleUserMessage: Message = {
  role: 'user',
  content: 'Navigate to Google and search for "test query"',
};

export const sampleAssistantMessage: Message = {
  role: 'assistant',
  content: 'I\'ll help you navigate to Google and search for "test query". Let me start by taking a screenshot to see the current page.',
};

export const sampleToolUseMessage: Message = {
  role: 'assistant',
  content: [
    { type: 'text', text: 'I\'ll take a screenshot first to see the current page.' },
    { type: 'tool_use', id: 'tool_1', name: 'browser_screenshot', input: {} },
  ],
};

export const sampleToolResultMessage: Message = {
  role: 'user',
  content: [{ type: 'tool_result', tool_use_id: 'tool_1', content: 'Screenshot taken successfully' }],
};

export const sampleConversationHistory: Message[] = [
  sampleUserMessage,
  sampleAssistantMessage,
  sampleToolUseMessage,
  sampleToolResultMessage,
];

export const complexUserMessage: Message = {
  role: 'user',
  content: 'Go to Amazon, search for "wireless headphones", filter by price under $100, and add the first result to cart',
};

export const memoryLookupMessage: Message = {
  role: 'user',
  content: 'Check my social media notifications and summarize them',
};

export const approvalRequiredMessage: Message = {
  role: 'user',
  content: 'Purchase the item in my cart using my saved payment method',
};

export const errorScenarioMessage: Message = {
  role: 'user',
  content: 'Navigate to https://invalid-url-that-does-not-exist.com',
};

export const multiStepTaskMessage: Message = {
  role: 'user',
  content: 'Book a flight from NYC to LA for next Friday, departing in the morning',
};
