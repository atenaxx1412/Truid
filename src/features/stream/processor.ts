/**
 * Message stream processor module
 * Handles Claude API stream processing with real-time output
 */
import { query } from '@anthropic-ai/claude-agent-sdk';
import chalk from 'chalk';
import type { Config, Environment } from '../../core/types.js';
import { renderMarkdown, addIndent } from '../markdown/renderer.js';

export async function processMessageStream(
  prompt: string,
  config: Config,
  env: Environment
): Promise<string> {
  const responseParts: string[] = [];
  let isFirstTextBlock = true;

  // Initialize query with environment-specific tools
  const result = query({
    prompt,
    options: {
      model: 'claude-sonnet-4-5',
      allowedTools: env.features.tools,
      systemPrompt: config.system_prompt,
    },
  });

  try {
    for await (const message of result) {
      // SDKSystemMessage - Session initialization
      if (message.type === 'system' && message.subtype === 'init') {
        if (env.features.debug) {
          console.log(chalk.dim('🔧 システム初期化完了'));
        }
        continue;
      }

      // SDKAssistantMessage - Claude's response
      if (message.type === 'assistant') {
        const content = message.message.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            // Text block
            if ('type' in block && block.type === 'text' && 'text' in block) {
              let text = block.text;
              responseParts.push(text);

              if (isFirstTextBlock) {
                // Output ⏺ symbol
                process.stdout.write('\n' + chalk.dim('⏺') + '\n');
                isFirstTextBlock = false;
              }

              // Render markdown with terminal renderer
              const rendered = renderMarkdown(text);

              // Add indent to all lines
              const indented = addIndent(rendered, '  ');

              // Output rendered and indented text
              process.stdout.write(indented + '\n');
            }

            // Tool use block
            if ('type' in block && block.type === 'tool_use') {
              const toolName = 'name' in block ? block.name : 'unknown';
              if (env.features.debug) {
                console.log(chalk.dim(`🔧 ツール使用: ${toolName}`));
              }
            }
          }
        }
      }

      // SDKToolProgressMessage - Tool execution progress
      if (message.type === 'tool_progress') {
        const toolName = message.tool_name;

        // Visual display of tool execution
        const toolIcons: Record<string, string> = {
          Bash: '🔧 実行中: bash コマンド',
          Read: '📖 読み込み中: ファイル',
          Write: '✍️  書き込み中: ファイル',
          Edit: '✏️  編集中: ファイル',
          WebSearch: '🔍 検索中: Web',
          Grep: '🔎 検索中: コード',
          Glob: '📁 検索中: ファイル',
        };

        const toolMessage = toolIcons[toolName] || `🔧 ${toolName}`;
        console.log(`\n${toolMessage}`);
      }

      // SDKResultMessage - Final result
      if (message.type === 'result') {
        if (message.subtype === 'success') {
          if (env.features.debug) {
            console.log(chalk.dim('\n✅ 処理完了'));
          }
        } else if (
          message.subtype === 'error_during_execution' ||
          message.subtype === 'error_max_turns' ||
          message.subtype === 'error_max_budget_usd'
        ) {
          const errors = message.errors;
          if (errors && errors.length > 0) {
            console.log(`\n❌ エラー: ${errors.join(', ')}`);
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`\n❌ エラーが発生しました: ${error.message}`);
    }
  }

  return responseParts.join('');
}
