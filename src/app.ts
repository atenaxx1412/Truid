/**
 * Main application logic
 * Shared between production and MVP modes
 */
import { config as loadEnv } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';
import chalk from 'chalk';
import type { Environment, ConversationEntry } from './core/types.js';
import { loadConfig } from './core/config.js';
import { getTerminalSize, isTerminalWideEnough, horizontalLine } from './core/terminal.js';
import { printLogo } from './features/logo/index.js';
import { displayPromptBox, closePromptBox } from './features/input/prompt.js';
import { processMessageStream } from './features/stream/processor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
loadEnv({ path: envPath });

class TruidApp {
  private conversationHistory: ConversationEntry[] = [];
  private env: Environment;

  constructor(env: Environment) {
    this.env = env;
  }

  addToHistory(user: string, assistant: string): void {
    this.conversationHistory.push({ user, assistant });
  }
}

export async function startApp(env: Environment): Promise<void> {
  // Check terminal size
  const termSize = getTerminalSize();

  // Check if terminal is wide enough
  if (!isTerminalWideEnough(50)) {
    console.log('\n警告: ターミナルの幅が狭すぎます。');
    console.log(`現在: ${termSize.columns}文字 / 推奨: 50文字以上\n`);
  }

  // Display permission confirmation with responsive layout
  const separator = horizontalLine('-', Math.min(termSize.columns, 70));

  console.log('\n' + separator);
  console.log('\nここでコーディングを開始しますか？\n');
  console.log(process.cwd());
  console.log('\nファイル操作の権限が必要です。');
  console.log('これにより以下が可能になります:');
  console.log('- このフォルダ内の任意のファイルを読み取る');
  console.log('- ファイルの作成、編集、削除');
  console.log('- コマンドの実行（npm、git、テスト、ls、rmなど）');
  console.log('- .mcp.json で定義されたツールの使用');
  console.log('\n詳細: https://docs.claude.com/s/claude-code-security');
  console.log('\n' + separator + '\n');

  // Create readline interface for permission check
  const permissionRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    permissionRl.question('> 1. Yes, continue\n  2. No, exit\n\n確認のため入力してください > Escキーで終了\n', (ans) => {
      permissionRl.close();
      resolve(ans.trim());
    });
  });

  if (answer !== '1' && answer.toLowerCase() !== 'yes') {
    console.log('\n起動をキャンセルしました\n');
    process.exit(0);
  }

  // Check OAuth Token
  const oauthToken = process.env.CLAUDE_CODE_OAUTH_TOKEN || process.env.ANTHROPIC_API_KEY;
  if (!oauthToken) {
    console.log('\nエラー: CLAUDE_CODE_OAUTH_TOKENが設定されていません');
    console.log('\n設定方法:');
    console.log('1. 別のターミナルで: claude setup-token');
    console.log('2. .envファイルに: CLAUDE_CODE_OAUTH_TOKEN=取得したtoken');
    return;
  }

  // Load configuration
  const config = loadConfig();
  const app = new TruidApp(env);

  // Display logo if enabled
  if (env.features.logo && config.show_logo !== false) {
    printLogo();
  }

  // Display session start message
  const modeText = env.mode === 'mvp' ? 'MVP開発モード' : '本番モード';
  const toolsText = env.mode === 'mvp'
    ? `最小限のツール (${env.features.tools.length}個)`
    : `全ツール有効 (${env.features.tools.length}個)`;

  console.log(`\n✅ Truidセッション開始 (${modeText} - ${toolsText})\n`);

  if (env.features.debug) {
    console.log(chalk.dim(`デバッグモード有効`));
    console.log(chalk.dim(`利用可能なツール: ${env.features.tools.join(', ')}\n`));
  }

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
  });

  let processing = false;

  // Display initial prompt box
  displayPromptBox();

  rl.on('line', async (input: string) => {
    if (processing) {
      return;
    }

    const userInput = input.trim();

    // Close the prompt box
    closePromptBox();

    // Empty input
    if (!userInput) {
      displayPromptBox();
      return;
    }

    // Exit command
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log('👋 セッション終了\n');
      rl.close();
      process.exit(0);
    }

    processing = true;

    try {
      // Display thinking indicator
      process.stdout.write('\n💭 考え中...');

      // Clear thinking indicator
      process.stdout.write('\r' + ' '.repeat(20) + '\r');

      // Process message
      const response = await processMessageStream(userInput, config, env);

      // Add to conversation history
      app.addToHistory(userInput, response);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`\n❌ エラーが発生しました: ${error.message}`);
        if (env.features.debug) {
          console.log(chalk.dim(error.stack || ''));
        }
      }
    } finally {
      processing = false;
      console.log(''); // Add spacing before next prompt box
      displayPromptBox();
    }
  });

  rl.on('close', () => {
    console.log('\n👋 終了しました\n');
    process.exit(0);
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n\n⚠️  処理を中断しました');
    if (processing) {
      console.log('続けるには入力してください。終了するには exit と入力してください。\n');
      displayPromptBox();
    } else {
      rl.close();
    }
  });
}
