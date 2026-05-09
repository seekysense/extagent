const STORAGE_KEY = 'skills';

export type ParsedStepType = 'navigate' | 'extract' | 'paginate' | 'fill' | 'play' | 'export';

export interface ParsedStep {
  type: ParsedStepType;
  payload: string;
  raw: string;
}

export interface SkillDefinition {
  title: string;
  description: string;
  steps: ParsedStep[];
  raw: string;
}

/**
 * Parse a skill markdown string into a SkillDefinition.
 * Expects YAML frontmatter delimited by --- lines.
 * Special step commands are backtick-enclosed: `command: payload`
 */
export function parseSkill(markdown: string): SkillDefinition {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) throw new Error('Missing frontmatter: skill file must start with --- YAML block ---');

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? '';
  const description = descMatch?.[1]?.trim() ?? '';

  const body = markdown.slice(frontmatterMatch[0].length);
  const steps: ParsedStep[] = [];

  for (const line of body.split('\n')) {
    const cmdMatch = line.match(/`(navigate|extract|paginate|fill|play|export):\s*([^`]*)`/);
    if (cmdMatch) {
      steps.push({
        type: cmdMatch[1] as ParsedStepType,
        payload: cmdMatch[2].trim(),
        raw: line.trim(),
      });
    }
  }

  return { title, description, steps, raw: markdown };
}

export class SkillManager {
  private static instance: SkillManager | null = null;

  static getInstance(): SkillManager {
    if (!SkillManager.instance) {
      SkillManager.instance = new SkillManager();
    }
    return SkillManager.instance;
  }

  async saveSkill(skill: SkillDefinition): Promise<void> {
    const all = await this._loadAll();
    all[skill.title] = skill;
    await chrome.storage.local.set({ [STORAGE_KEY]: all });
  }

  async getSkill(title: string): Promise<SkillDefinition | null> {
    const all = await this._loadAll();
    // Exact match first
    if (all[title]) return all[title];
    // Case-insensitive exact match
    const lower = title.toLowerCase();
    const ciKey = Object.keys(all).find(k => k.toLowerCase() === lower);
    if (ciKey) return all[ciKey];
    // Partial match: title contains query or query contains title
    const partialKey = Object.keys(all).find(k =>
      k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())
    );
    if (partialKey) return all[partialKey];
    return null;
  }

  async listSkills(): Promise<SkillDefinition[]> {
    const all = await this._loadAll();
    return Object.values(all);
  }

  async deleteSkill(title: string): Promise<void> {
    const all = await this._loadAll();
    delete all[title];
    await chrome.storage.local.set({ [STORAGE_KEY]: all });
  }

  async importFromFile(content: string): Promise<SkillDefinition> {
    const skill = parseSkill(content);
    await this.saveSkill(skill);
    return skill;
  }

  exportToFile(skill: SkillDefinition): string {
    return skill.raw;
  }

  private async _loadAll(): Promise<Record<string, SkillDefinition>> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return (result[STORAGE_KEY] as Record<string, SkillDefinition>) ?? {};
  }
}
