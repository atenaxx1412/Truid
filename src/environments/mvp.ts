/**
 * MVP development environment configuration
 * Minimal toolset for rapid testing
 */
import type { Environment } from '../core/types.js';

export const mvpEnv: Environment = {
  mode: 'mvp',
  features: {
    logo: true,
    markdown: true,
    tools: [
      'Read',
      'Bash',
      'WebSearch',
    ],
    debug: true,
  },
};
