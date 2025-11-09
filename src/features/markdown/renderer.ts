/**
 * Markdown renderer module
 * Uses marked and marked-terminal for beautiful terminal output
 */
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import chalk from 'chalk';

/**
 * Initialize and update marked configuration based on terminal width
 */
export function updateMarkedWidth(): void {
  const terminalWidth = process.stdout.columns || 80;
  marked.setOptions({
    // @ts-ignore - TerminalRenderer types might not be perfect
    renderer: new TerminalRenderer({
      width: terminalWidth - 4, // Reserve space for indent
      reflowText: true,
      code: chalk.cyan,
      blockquote: chalk.gray.italic,
      html: chalk.gray,
      heading: chalk.bold.underline,
      firstHeading: chalk.bold.underline,
      hr: chalk.gray,
      listitem: chalk.reset,
      table: chalk.reset,
      paragraph: chalk.reset,
      strong: chalk.bold,
      em: chalk.italic,
      codespan: chalk.cyan,
      del: chalk.dim.strikethrough,
      link: chalk.blue.underline,
      href: chalk.blue.underline,
    })
  });
}

/**
 * Render markdown text with proper formatting
 */
export function renderMarkdown(text: string): string {
  updateMarkedWidth();
  let rendered = marked(text) as string;
  // Remove trailing newlines
  rendered = rendered.replace(/\n+$/, '');
  return rendered;
}

/**
 * Add left indent to all non-empty lines of text
 */
export function addIndent(text: string, indent: string = '  '): string {
  return text
    .split('\n')
    .map(line => {
      // Don't add indent to completely empty lines
      if (line.trim() === '') {
        return '';
      }
      return indent + line;
    })
    .join('\n');
}

// Setup terminal resize handler
if (process.stdout.isTTY) {
  process.stdout.on('resize', () => {
    updateMarkedWidth();
  });
}

// Initial setup
updateMarkedWidth();
