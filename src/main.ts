#!/usr/bin/env node
/**
 * Production Entry Point
 * Full-featured Truid with all tools enabled
 */
import { productionEnv } from './environments/production.js';
import { startApp } from './app.js';

console.log('🚀 Truid (Production Mode)');

startApp(productionEnv).catch((error) => {
  console.error('❌ 致命的なエラー:', error);
  process.exit(1);
});
