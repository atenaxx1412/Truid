/**
 * Terminal utility functions
 */

export interface TerminalSize {
  columns: number;
  rows: number;
}

/**
 * Get current terminal size
 */
export function getTerminalSize(): TerminalSize {
  const columns = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;
  return { columns, rows };
}

/**
 * Check if terminal is wide enough
 */
export function isTerminalWideEnough(minWidth: number = 60): boolean {
  const { columns } = getTerminalSize();
  return columns >= minWidth;
}

/**
 * Wrap text to fit terminal width
 */
export function wrapText(text: string, maxWidth?: number): string {
  const { columns } = getTerminalSize();
  const width = maxWidth || Math.max(columns - 4, 40);

  const lines: string[] = [];
  const words = text.split(' ');
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= width) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}

/**
 * Center text within terminal width
 */
export function centerText(text: string): string {
  const { columns } = getTerminalSize();
  const padding = Math.max(0, Math.floor((columns - text.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Create a horizontal line
 */
export function horizontalLine(char: string = '-', width?: number): string {
  const { columns } = getTerminalSize();
  const lineWidth = width || Math.min(columns, 80);
  return char.repeat(lineWidth);
}
