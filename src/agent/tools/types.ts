import type { Page } from "playwright-crx/test";

export interface BrowserTool {
  name: string;
  description: string;
  func: (input: string, context?: ToolExecutionContext) => Promise<string>;
}

export interface ToolExecutionContext {
  requiresApproval?: boolean;
  approvalReason?: string;
}

export type ToolFactory = (page: Page) => BrowserTool;
