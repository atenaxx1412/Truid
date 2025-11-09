/**
 * Configuration management module
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Config } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadConfig(configPath?: string): Config {
  const finalPath = configPath || path.join(__dirname, '..', '..', 'config.json');

  try {
    const data = fs.readFileSync(finalPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return default configuration if file doesn't exist
    return getDefaultConfig();
  }
}

export function getDefaultConfig(): Config {
  return {
    ai_name: 'Truid',
    ai_emoji: '🤖',
    ai_personality: '親しみやすいアシスタント',
    greeting_message: 'こんにちは！何かお手伝いできることはありますか？',
    show_logo: true,
    theme: {
      thinking_emoji: '💭',
      success_emoji: '✅',
      error_emoji: '❌',
      tool_emoji: '🔧',
    },
    system_prompt: 'あなたは親切で知識豊富なAIアシスタントです。',
  };
}
