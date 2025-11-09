#!/usr/bin/env node
/**
 * MVP Development Entry Point
 * Minimal toolset for rapid testing and development
 */
import chalk from 'chalk';
import { mvpEnv } from './environments/mvp.js';
import { startApp } from './app.js';

console.log(chalk.yellow('🧪 Truid (MVP Development Mode)'));
console.log(chalk.dim('⚠️  デバッグモード有効 - 最小限のツールのみ\n'));

startApp(mvpEnv).catch((error) => {
  console.error('❌ 致命的なエラー:', error);
  process.exit(1);
});
