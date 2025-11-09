/**
 * Production environment configuration
 */
import type { Environment } from '../core/types.js';

export const productionEnv: Environment = {
  mode: 'production',
  features: {
    logo: true,
    markdown: true,
    tools: [
      'Read',
      'Write',
      'Edit',
      'Glob',
      'Grep',
      'Bash',
      'Task',
      'WebSearch',
      'WebFetch',
      'TodoWrite',
      'NotebookEdit',
      'ExitPlanMode',
      'BashOutput',
      'KillShell',
      'Skill',
      'SlashCommand',
    ],
    debug: false,
  },
};
