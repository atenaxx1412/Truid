/**
 * Input prompt module
 * Handles user input prompts with dynamic terminal width support
 */

export function getSeparator(): string {
  const terminalWidth = process.stdout.columns || 80;
  return '─'.repeat(terminalWidth);
}

export function displayPromptBox(): void {
  console.log(getSeparator());
  process.stdout.write('> ');
}

export function closePromptBox(): void {
  console.log(getSeparator());
}
