import type { Page } from "playwright-crx";
import { RecordingManager } from "../../background/recordingManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function playAutomation(_page: Page) {
  return {
    name: 'play_automation',
    description: 'Replay a recorded automation sequence step by step using browser tools. Input: JSON {recordingName, instruction?, confirmBeforeEachStep?}.',
    func: async (input: string): Promise<string> => {
      let parsed: { recordingName: string; instruction?: string; confirmBeforeEachStep?: boolean };
      try {
        parsed = JSON.parse(input);
      } catch {
        return JSON.stringify({ success: false, stepsExecuted: 0, errors: ['Invalid JSON input'] });
      }

      const { recordingName, instruction } = parsed;
      const manager = RecordingManager.getInstance();
      const recording = await manager.getRecording(recordingName);

      if (!recording) {
        return JSON.stringify({
          success: false,
          stepsExecuted: 0,
          errors: [`Recording not found: "${recordingName}"`],
        });
      }

      const stepsText = recording.steps
        .map((s, i) => {
          const action = s.description ?? `${s.type} ${s.selector ?? s.url ?? ''}`;
          const value = s.text ? ` → "${s.text}"` : '';
          return `${i + 1}. [${s.type}] ${action}${value}`.trim();
        })
        .join('\n');

      const lines = [
        `Execute the recorded sequence "${recording.name}" step by step.`,
        'For each step, locate the corresponding element on the current page and perform the action.',
      ];
      if (instruction) lines.push(`Additional instructions: ${instruction}`);
      lines.push(`Sequence (${recording.steps.length} steps):\n${stepsText}`);

      return JSON.stringify({
        success: true,
        stepsExecuted: recording.steps.length,
        prompt: lines.join('\n'),
        errors: [],
      });
    },
  };
}
