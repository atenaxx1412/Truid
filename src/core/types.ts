/**
 * Core type definitions for Truid application
 */

export interface Config {
  ai_name: string;
  ai_emoji: string;
  ai_personality: string;
  greeting_message: string;
  show_logo?: boolean;
  theme: {
    primary_color?: string;
    thinking_emoji: string;
    success_emoji: string;
    error_emoji: string;
    tool_emoji: string;
  };
  system_prompt: string;
}

export interface Environment {
  mode: 'production' | 'mvp';
  features: {
    logo: boolean;
    markdown: boolean;
    tools: string[];
    debug: boolean;
  };
}

export interface ConversationEntry {
  user: string;
  assistant: string;
}
