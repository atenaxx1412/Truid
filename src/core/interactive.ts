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
      // Render each option
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        const prefix = isSelected ? chalk.green('→') : ' ';
        const text = isSelected ? chalk.green(option.label) : chalk.dim(option.label);

        process.stdout.write(prefix + ' ' + text + '\n');
      });

      // Empty line
      process.stdout.write('\n');

      // Add instructions (with newline to move cursor to next line)
      process.stdout.write(chalk.dim('矢印キー: 選択  Enter: 確定  Esc: 終了') + '\n');
    };

    const updateDisplay = () => {
      // Move cursor up to start of options
      // options.length lines + 1 empty line + 1 instruction line
      const linesToMove = options.length + 2;
      process.stdout.write(`\x1b[${linesToMove}A`);

      // Clear from cursor to end of screen
      process.stdout.write('\x1b[J');

      // Re-render options
      renderOptions();
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
        updateDisplay();
      } else if (key === '\u001b[B') {
        // Down arrow
        selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        updateDisplay();
      } else if (key === '\r' || key === '\n') {
        // Enter
        cleanup();
        // Clear the line and move to next line
        process.stdout.write('\r\x1b[K\n');
        resolve(options[selectedIndex].value);
      } else if (key === '\u001b' || key === '\u0003') {
        // Esc or Ctrl+C
        cleanup();
        process.stdout.write('\r\x1b[K\n');
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
