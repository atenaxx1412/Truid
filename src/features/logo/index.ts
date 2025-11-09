/**
 * Logo display module
 */

export function printLogo(): void {
  const terminalWidth = process.stdout.columns || 80;
  const logoWidth = 68;
  const padding = terminalWidth > logoWidth
    ? ' '.repeat(Math.floor((terminalWidth - logoWidth) / 2))
    : '';

  const logo = `
${padding}╔════════════════════════════════════════════════════════════════════╗
${padding}║                                                                    ║
${padding}║             ████████╗██████╗ ██╗   ██╗██╗██████╗                   ║
${padding}║             ╚══██╔══╝██╔══██╗██║   ██║██║██╔══██╗                  ║
${padding}║                ██║   ██████╔╝██║   ██║██║██║  ██║                  ║
${padding}║                ██║   ██╔══██╗██║   ██║██║██║  ██║                  ║
${padding}║                ██║   ██║  ██║╚██████╔╝██║██████╔╝                  ║
${padding}║                ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝╚═════╝                   ║
${padding}║                                                                    ║
${padding}║                     Personal AI Assistant                          ║
${padding}║                        Created by Atena                            ║
${padding}║                           from Japan                               ║
${padding}╚════════════════════════════════════════════════════════════════════╝
`;
  console.log(logo);
}
