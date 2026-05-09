import { getLang, Lang } from "../i18n";
import { TOOL_DESCRIPTIONS_EN } from "./tools/descriptions.en";
import { TOOL_DESCRIPTIONS_IT } from "./tools/descriptions.it";
import { BrowserTool } from "./tools/types";

function getOsInfo(): { os: string; modifier: string } {
  try {
    const ua = navigator.userAgent;
    if (ua.indexOf('Mac') !== -1) return { os: 'macOS', modifier: 'Command' };
    if (ua.indexOf('Win') !== -1) return { os: 'Windows', modifier: 'Control' };
    return { os: 'Linux', modifier: 'Control' };
  } catch {
    return { os: 'Linux', modifier: 'Control' };
  }
}

const MEMORY_EXAMPLE_IT = `Domain: www.esempio.com
Task: Effettua una ricerca
Tools:
browser_click | input[name="q"]
browser_keyboard_type | [termine]
browser_press_key | Enter`;

const MEMORY_EXAMPLE_EN = `Domain: www.example.com
Task: Perform a search
Tools:
browser_click | input[name="q"]
browser_keyboard_type | [term]
browser_press_key | Enter`;

function buildPromptIT(toolDescriptions: string, os: string, modifier: string): string {
  return `Sei **InfinitAgent**, un agente AI che aiuta gli operatori ad estrarre dati e automatizzare operazioni su portali web aziendali.

## Strumenti disponibili
${toolDescriptions}

## Sequenza canonica
1. Identifica il dominio corrente.
2. Chiama \`lookup_memories\` con quel dominio — leggi il risultato prima di procedere.
3. Se la memoria corrisponde alla richiesta, ripeti gli step indicati verbatim.
4. Osserva: usa \`browser_accessible_tree\` o \`browser_read_text\` per capire la pagina. Usa \`browser_snapshot_dom\` solo se necessario.
5. Analizza → agisci passo per passo.

## Gestione tab multipli
Tutti i tool operano sul tab attivo. Usa \`browser_tab_select\` per cambiare tab. Usa \`browser_get_active_tab\` per verificare il tab corrente.

## Formato tool call
Rispondi sempre con questo formato esatto:

<tool>nome_tool</tool>
<input>argomenti</input>
<requires_approval>true o false</requires_approval>

Imposta \`requires_approval=true\` per acquisti, cancellazioni, invio form, o qualsiasi azione irreversibile. Se in dubbio, scegli \`true\`.

## Formato memoria
\`\`\`
${MEMORY_EXAMPLE_IT}
\`\`\`

## Regole
- Estrazione dati strutturati: usa sempre \`extract_with_schema\`.
- Sistema: ${os} — usa ${modifier} come modificatore.
- Rispondi sempre in italiano.
- Attendi il risultato di ogni tool prima del passo successivo.`;
}

function buildPromptEN(toolDescriptions: string, os: string, modifier: string): string {
  return `You are **InfinitAgent**, an AI agent that helps operators extract data and automate operations on corporate web portals.

## Available Tools
${toolDescriptions}

## Canonical Sequence
1. Identify the current domain.
2. Call \`lookup_memories\` with that domain — read the result before proceeding.
3. If the memory matches the request, replay the listed steps verbatim.
4. Observe: use \`browser_accessible_tree\` or \`browser_read_text\` to understand the page. Use \`browser_snapshot_dom\` only if necessary.
5. Analyze → act step by step.

## Multi-tab management
All tools operate on the active tab. Use \`browser_tab_select\` to switch tabs. Use \`browser_get_active_tab\` to verify the current tab.

## Tool call format
Always reply with this exact format:

<tool>tool_name</tool>
<input>arguments</input>
<requires_approval>true or false</requires_approval>

Set \`requires_approval=true\` for purchases, deletions, form submissions, or any irreversible action. When in doubt, choose \`true\`.

## Memory format
\`\`\`
${MEMORY_EXAMPLE_EN}
\`\`\`

## Rules
- Structured data extraction: always use \`extract_with_schema\`.
- System: ${os} — use ${modifier} as modifier key.
- Always reply in English.
- Wait for each tool result before the next step.`;
}

export class PromptManager {
  private tools: BrowserTool[];
  private currentPageContext: string = "";
  private profileAddendum: string = "";

  constructor(tools: BrowserTool[]) {
    this.tools = tools ?? [];
  }

  setCurrentPageContext(url: string, title: string): void {
    this.currentPageContext = `## CURRENT PAGE CONTEXT\nSei attualmente su ${url} (${title}).`;
  }

  setProfileAddendum(addendum: string): void {
    this.profileAddendum = addendum ?? '';
  }

  async getSystemPrompt(lang?: Lang): Promise<string> {
    const effectiveLang = lang ?? (await getLang().catch(() => 'it' as Lang));

    let customPrompt = '';
    try {
      const result = await chrome.storage.local.get({ customSystemPrompt: '' });
      customPrompt = result.customSystemPrompt || '';
    } catch {
      // storage unavailable (e.g. in non-extension test context)
    }

    if (customPrompt) {
      return this.injectContext(customPrompt);
    }

    const descs = effectiveLang === 'en' ? TOOL_DESCRIPTIONS_EN : TOOL_DESCRIPTIONS_IT;
    const toolDescriptions = this.tools
      .map(t => `${t.name}: ${descs[t.name] ?? t.description}`)
      .join('\n');

    const { os, modifier } = getOsInfo();
    const base = effectiveLang === 'en'
      ? buildPromptEN(toolDescriptions, os, modifier)
      : buildPromptIT(toolDescriptions, os, modifier);

    return this.injectContext(base);
  }

  private injectContext(prompt: string): string {
    let result = prompt;
    if (this.currentPageContext) result = `${result}\n\n${this.currentPageContext}`;
    if (this.profileAddendum) result = `${result}\n\n## Domain Profile\n${this.profileAddendum}`;
    return result;
  }

  updateTools(tools: BrowserTool[]): void {
    this.tools = tools ?? [];
  }
}
