import type { Page } from "playwright-crx";
import { SkillManager } from "../skillManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useSkill(_page: Page) {
  return {
    name: 'use_skill',
    description: 'Execute a saved skill by title. Interprets the skill steps (navigate, extract, paginate, fill, play) and returns the execution prompt. Input: JSON {skillTitle, params?}.',
    func: async (input: string): Promise<string> => {
      let parsed: { skillTitle: string; params?: Record<string, string> };
      try {
        parsed = JSON.parse(input);
      } catch {
        return JSON.stringify({ success: false, stepsExecuted: 0, errors: ['Invalid JSON input'] });
      }

      const { skillTitle, params = {} } = parsed;
      const manager = SkillManager.getInstance();
      const skill = await manager.getSkill(skillTitle);

      if (!skill) {
        return JSON.stringify({
          success: false,
          stepsExecuted: 0,
          errors: [`Skill not found: "${skillTitle}"`],
        });
      }

      // Extract body (everything after closing ---)
      const bodyMatch = skill.raw.match(/^---[\s\S]*?---\n([\s\S]*)$/);
      let body = bodyMatch ? bodyMatch[1].trim() : '';

      // Substitute {{param}} placeholders in body
      for (const [k, v] of Object.entries(params)) {
        body = body.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      }

      const lines = [
        `SKILL: "${skillTitle}" — ${skill.description}`,
        '',
        'FOLLOW THESE INSTRUCTIONS EXACTLY, in order, using the appropriate browser tools:',
        '',
        body,
      ];

      return lines.join('\n');
    },
  };
}
