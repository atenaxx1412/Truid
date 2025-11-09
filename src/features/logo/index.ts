/**
 * Logo display module
 */

export function printLogo(): void {
  const terminalWidth = process.stdout.columns || 80;
  const logoWidth = 72;

  // If terminal is too narrow, show simple logo
  if (terminalWidth < logoWidth) {
    console.log('\n==============================================');
    console.log('           TRUID');
    console.log('    Personal AI Assistant');
    console.log('      Created by Atena');
    console.log('         from Japan');
    console.log('==============================================\n');
    return;
  }

  // Calculate padding for centering
  const padding = ' '.repeat(Math.floor((terminalWidth - logoWidth) / 2));

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
