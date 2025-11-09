/**
 * Interactive selection utilities
 */
import chalk from 'chalk';
import { getTerminalSize } from './terminal.js';

export interface SelectOption {
  label: string;
  value: string | boolean;
}

/**
 * Display interactive selection menu with arrow key navigation
 */
export async function interactiveSelect(
  options: SelectOption[],
  defaultIndex: number = 0
): Promise<string | boolean> {
  return new Promise((resolve) => {
    let selectedIndex = defaultIndex;

    const renderOptions = () => {
      // Clear previous lines
      if (selectedIndex > 0) {
        process.stdout.write('\x1b[' + (options.length + 1) + 'A'); // Move cursor up
      }

      // Render each option
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        const prefix = isSelected ? chalk.green('→') : ' ';
        const text = isSelected ? chalk.green(option.label) : chalk.dim(option.label);

        // Clear line and write
        process.stdout.write('\r\x1b[K' + prefix + ' ' + text + '\n');
      });

      // Add instructions
      process.stdout.write('\r\x1b[K' + chalk.dim('\n矢印キー: 選択  Enter: 確定  Esc: 終了'));
    };

    // Initial render
    console.log(''); // Empty line for spacing
    renderOptions();

    // Enable raw mode to capture key presses
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const onData = (key: string) => {
      // Handle key presses
      if (key === '\u001b[A') {
        // Up arrow
        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        renderOptions();
      } else if (key === '\u001b[B') {
        // Down arrow
        selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        renderOptions();
      } else if (key === '\r' || key === '\n') {
        // Enter
        cleanup();
        console.log('\n'); // Add spacing after selection
        resolve(options[selectedIndex].value);
      } else if (key === '\u001b' || key === '\u0003') {
        // Esc or Ctrl+C
        cleanup();
        console.log('\n');
        process.exit(0);
      }
    };

    const cleanup = () => {
      process.stdin.removeListener('data', onData);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    };

    process.stdin.on('data', onData);
  });
}
