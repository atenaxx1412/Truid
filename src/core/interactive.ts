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
    let isFirstRender = true;

    const renderOptions = () => {
      if (!isFirstRender) {
        // Move cursor up to the start of the options
        // Need to move: options + empty line + instructions line
        const linesToMove = options.length + 2;
        process.stdout.write('\x1b[' + linesToMove + 'A');
      }

      // Render each option
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        const prefix = isSelected ? chalk.green('→') : ' ';
        const text = isSelected ? chalk.green(option.label) : chalk.dim(option.label);

        // Clear entire line and write
        process.stdout.write('\x1b[2K\r' + prefix + ' ' + text + '\n');
      });

      // Empty line
      process.stdout.write('\x1b[2K\r\n');

      // Add instructions (no newline before, already on new line)
      process.stdout.write('\x1b[2K\r' + chalk.dim('矢印キー: 選択  Enter: 確定  Esc: 終了'));

      isFirstRender = false;
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
