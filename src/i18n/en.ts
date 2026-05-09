export const en: Record<string, string> = {
  'app.title': 'InfinitAgent',

  // Side panel
  'sidepanel.tagline': 'What can I do for you today?',
  'sidepanel.placeholder': 'Type a message...',
  'sidepanel.placeholderDisconnected': 'Tab connection lost. Please refresh the tab to continue.',
  'sidepanel.noProvider': 'No LLM provider configured',
  'sidepanel.noProviderDesc': 'You need to configure an LLM provider before you can use InfinitAgent.',
  'sidepanel.configureProvider': 'Configure Providers',
  'sidepanel.noOutput': 'No output yet',

  // Agent status
  'agent.idle': 'Idle',
  'agent.thinking': 'Thinking...',
  'agent.executing': 'Executing...',
  'agent.waitingApproval': 'Waiting for approval',
  'agent.running': 'Agent Running',
  'agent.error': 'Agent Error',
  'agent.unknown': 'Unknown',

  // Tab
  'tab.connected': 'Connected',
  'tab.disconnected': 'Disconnected',
  'tab.attach': 'Attach to current tab',

  // Actions
  'action.stop': 'Cancel',
  'action.send': 'Execute',
  'action.clear': 'Clear conversation history and LLM context',
  'action.reflect': 'Reflect and learn from this session',
  'action.refreshTab': 'Refresh tab to continue',
  'action.settings': 'Open Settings',
  'action.help': 'Open Help',

  // Approval
  'approval.title': 'Approval Required',
  'approval.desc': 'The agent wants to execute a critical action:',
  'approval.tool': 'Tool:',
  'approval.input': 'Input:',
  'approval.reason': 'Reason:',
  'approval.approve': 'Approve',
  'approval.deny': 'Reject',

  // Token usage
  'token.usage': 'Token Usage:',
  'token.cost': 'Estimated Cost:',

  // Screenshot
  'screenshot.label': 'Screenshot captured:',
  'screenshot.alt': 'Screenshot',

  // Output
  'output.title': 'Output',

  // Options tabs
  'options.tabs.general': 'General',
  'options.tabs.llm': 'LLM Configuration',
  'options.tabs.memory': 'Memory',
  'options.saved': 'Settings saved!',

  // General tab
  'general.gettingStarted': '🚀 Getting Started',
  'general.steps.intro': 'Follow these simple steps to start using InfinitAgent:',
  'general.steps.1.title': '1. Get an API Key',
  'general.steps.1.desc': 'Obtain an API key from your OpenAI-compatible LLM provider:',
  'general.steps.2.title': '2. Configure InfinitAgent',
  'general.steps.2.desc': 'Go to the LLM Configuration tab and:',
  'general.steps.2.a': 'Select your preferred provider',
  'general.steps.2.b': 'Enter your API key',
  'general.steps.2.c': 'Click Save Settings',
  'general.steps.3.title': '3. Run Your First Task',
  'general.steps.3.desc': 'Try this example to get started:',
  'general.steps.3.a': 'Open a new tab and go to google.com',
  'general.steps.3.b': 'Click the InfinitAgent icon or press Alt+Shift+E',
  'general.steps.3.c': '"Search for the weather in Paris"',
  'general.steps.3.d': 'Press Enter and watch InfinitAgent work!',
  'general.tips.title': '💡 Pro Tips',
  'general.tips.1': 'Keep InfinitAgent attached: Leave it connected to a tab throughout your session for best performance',
  'general.tips.2': 'Reattach if needed: If you close the attached tab, use the reattach button to reconnect',
  'general.tips.3': 'One per window: You can run one InfinitAgent instance per Chrome window',
  'general.tips.4': "Tab limitations: InfinitAgent can't attach to new tabs or chrome:// pages",
  'general.needHelp': 'Need Help?',
  'general.joinDiscord': 'Join Discord Community',
  'general.discordDesc': 'Get help, share tips, and connect with other InfinitAgent users',
  'general.language': 'Language',
  'general.language.it': 'Italiano',
  'general.language.en': 'English',
  'general.customPrompt.title': 'Custom System Prompt',
  'general.customPrompt.desc': 'Leave empty to use the default prompt. The custom prompt overrides the default without restarting the extension.',
  'general.customPrompt.active': 'Custom prompt active',
  'general.customPrompt.placeholder': 'Paste your custom system prompt here...',
  'general.customPrompt.save': 'Save prompt',
  'general.customPrompt.reset': 'Restore default',

  // Quick actions
  'quickactions.smartPaste': 'Smart Paste',
  'quickactions.smartExtract': 'Smart Extract',
  'quickactions.automate': 'Automate',
  'quickactions.pasteHint': 'Paste here the information to fill into the form...',
  'quickactions.compila': 'Fill Form',
  'quickactions.analyzeHint': 'Analyzing page...',
  'quickactions.extractNow': 'Extract',
  'quickactions.format.json': 'JSON',
  'quickactions.format.csv': 'CSV',
  'quickactions.multipage': 'Multi-page',
  'quickactions.proposedFields': 'Detected fields',

  // About
  'about.title': 'About',
  'about.desc1': 'InfinitAgent is a Chrome extension that allows you to control your browser using natural language. It uses an OpenAI-compatible LLM backend to interpret your instructions and Playwright to execute them.',
  'about.desc2': 'To use the extension, click on the extension icon to open the side panel, then enter your instructions in the prompt field and hit Enter.',

  // LLM Config
  'llm.title': 'LLM Endpoint Configuration',
  'llm.desc': 'Configure the OpenAI-compatible endpoint. Your API key is stored locally in the browser.',

  // Provider config
  'provider.title': 'LLM Provider Configuration',
  'provider.desc': "Configure your OpenAI-compatible endpoint and API settings. Your API key is stored securely in your browser's storage.",
  'provider.selector.label': 'LLM Provider:',
  'provider.openaiCompatible': 'OpenAI-Compatible Endpoint',

  // OpenAI compatible settings
  'openai.settings.title': 'OpenAI Compatible Settings',
  'openai.apiKey': 'API Key:',
  'openai.apiKeyPlaceholder': 'API key (optional if local endpoint)',
  'openai.baseUrl': 'Base URL:',
  'openai.baseUrlPlaceholder': 'e.g. http://localhost:8000/v1',
  'openai.testConnection': 'Test connection',
  'openai.connectionOk': 'Connection successful',
  'openai.missingConfig': 'Enter API Key and Base URL',

  // Profiles
  'openai.profiles.title': 'Model Profiles',
  'openai.profiles.empty': 'No profile configured. Add one.',
  'openai.profiles.setDefault': 'Set as default',
  'openai.profiles.default': 'DEFAULT',
  'openai.profiles.namePlaceholder': 'Profile name',
  'openai.profiles.enableThinking': 'Enable thinking (enable_thinking)',
  'openai.profiles.thinkingBudget': 'Thinking budget (tokens)',
  'openai.profiles.thinkingBudgetPlaceholder': 'e.g. 8192',
  'openai.profiles.contextWindow': 'Context window',
  'openai.profiles.temperature': 'Temperature',
  'openai.profiles.temperatureForced': '(forced 1)',
  'openai.profiles.maxTokens': 'Max tokens',
  'openai.profiles.thinkingOn': '⚡ Thinking ON',
  'openai.profiles.thinkingOff': '🚀 Fast (no thinking)',
  'openai.profiles.remove': 'Remove',
  'openai.profiles.new': 'NEW PROFILE',
  'openai.profiles.name': 'Name',
  'openai.profiles.namePlaceholderNew': 'e.g. Qwen3 Thinking',
  'openai.profiles.modelId': 'Model ID',
  'openai.profiles.modelIdPlaceholder': 'e.g. qwen3-35b',
  'openai.profiles.enableThinkingShort': 'Enable thinking',
  'openai.profiles.add': 'Add profile',

  // Routing
  'openai.routing.title': 'Function routing',
  'openai.routing.desc': 'Associate each function with a specific profile. If not set, the default profile is used.',
  'openai.routing.noProfiles': 'Add at least one profile to configure routing.',
  'openai.routing.function': 'Function',
  'openai.routing.profile': 'Profile used',
  'openai.routing.useDefault': '— use default —',

  // Function names
  'function.default': 'Default (fallback)',
  'function.automation': 'Browser Automation',
  'function.skill': 'Skill Execution',
  'function.recording': 'Sequence Recording',
  'function.smartPaste': 'Smart Paste',
  'function.smartExtract': 'Smart Extract',
  'function.observation': 'Observation / Analysis',

  // Memory
  'memory.title': 'Memory Management',
  'memory.desc': 'InfinitAgent stores memories of successful interactions with websites to help improve future interactions. You can export these memories for backup or transfer to another device, and import them back later.',
  'memory.current': 'Current memories:',
  'memory.export': 'Export Memories',
  'memory.import': 'Import Memories',
  'memory.exporting': 'Exporting...',
  'memory.importing': 'Importing...',
  'memory.exportSuccess': 'Successfully exported {count} memories!',
  'memory.importSuccess': 'Successfully imported {count} memories!',
  'memory.invalidFormat': 'Invalid format: Expected an array of memories',
  'memory.parseError': 'Error parsing import file: {error}',
  'memory.importError': 'Error importing memories: {error}',
  'memory.exportError': 'Error exporting memories: {error}',
  'memory.agentTitle': 'Agent Memories',
  'memory.validate': '✓ Validate',
  'memory.validated': 'Validated',
  'memory.validatedCount': '{validated} validated / {total} total',
  'memory.empty': 'No saved memories.',

  // Skills
  'skills.title': 'Skill Management',
  'skills.desc': 'Skills are micro-programs saved as .md files that automate sequences of operations.',
  'skills.new': '+ New skill',
  'skills.import': '⬆ Import .md',
  'skills.export': 'Export .md',
  'skills.run': 'Run',
  'skills.edit': 'Edit',
  'skills.delete': 'Delete',
  'skills.save': 'Save',
  'skills.cancel': 'Cancel',
  'skills.empty': 'No saved skills.',
  'skills.steps': 'steps',
  'skills.editorTitle': 'Title',
  'skills.editorDesc': 'Description',
  'skills.editorBody': 'Body (Markdown)',
  'skills.titlePlaceholder': 'e.g. Tender collection',
  'skills.descPlaceholder': 'e.g. Extracts public tenders...',
  'skills.bodyPlaceholder': '## Steps\n\n1. First step\n   - `navigate: https://...`',
  'options.tabs.skills': 'Skills',

  // Recording
  'recording.start': '● Start recording',
  'recording.stop': '⏹ Stop & save',
  'recording.save': 'Save',
  'recording.cancel': 'Cancel',
  'recording.steps': 'recorded actions',
  'recording.namePlaceholder': 'Recording name...',
  'recording.descPlaceholder': 'Description (optional)...',
  'recording.play': 'Play',
  'recording.export': 'Export JSON',
  'recording.delete': 'Delete',
  'recording.import': 'Import JSON',

  // Output & export
  'output.copyJson': 'Copy JSON',
  'output.downloadJson': 'Download JSON',
  'output.exportCsv': 'Export CSV',
  'output.copyTable': 'Copy table',

  // Task history
  'history.title': 'History',
  'history.rerun': 'Rerun',

  // Domain profiles
  'options.tabs.profiles': 'Domain Profiles',
  'profile.title': 'Domain Profiles',
  'profile.desc': 'Domain profiles enrich the system prompt and provide hints for specific web portals.',
  'profile.new': '+ New profile',
  'profile.export': 'Export JSON',
  'profile.import': 'Import JSON',
  'profile.empty': 'No profiles configured.',
  'profile.save': 'Save',
  'profile.cancel': 'Cancel',
  'profile.editorName': 'Name',
  'profile.editorPattern': 'Domain pattern (glob)',
  'profile.editorAddendum': 'System prompt addendum',
  'profile.editorHints': 'Selector hints',
  'profile.editorSchema': 'Default JSON schema',
  'profile.namePlaceholder': 'e.g. ACME Supplier Portal',
  'profile.patternPlaceholder': 'e.g. *.acme.it or gestionale.acme.it/suppliers*',
  'profile.addendumPlaceholder': 'Text appended to the system prompt when browsing this domain...',
  'profile.hintsPlaceholder': 'Hints about selectors or portal structure...',
  'profile.invalidJson': 'Invalid JSON',

  // Errors
  'error.contextOverflow': 'Context too long: the conversation has been truncated to continue.',
  'error.llmTimeout': 'LLM request timed out. Please try again.',
  'error.maxStepsReached': 'Stopped: maximum number of steps reached.',
  'error.tabClosed': 'The attached tab was closed. Please reattach to continue.',
  'error.tabReloaded': 'The attached tab was reloaded.',
  'error.cdpDisconnected': 'Browser connection lost. Please reattach the tab.',
  'error.restrictedPage': 'This page cannot be accessed by the extension.',

  // Save
  'save.saving': 'Saving...',
  'save.save': 'Save Settings',
};
