import chalk from 'chalk';
import { terminal } from './terminal';
import figlet from 'figlet'
export async function renderBanner(): Promise<void> {
  // terminal.writeLine('');
  // terminal.writeLine(chalk.bold.cyan(terminal.centerText('🎮 INTERVIEWQUEST')));
  
 const banner = await figlet.text("Interview",{horizontalLayout:'full'});
 const banner2 = await figlet.text("Quest",{horizontalLayout:'full'});
 
  
  const totalContentHeight = banner.split('\n').length + banner2.split('\n').length + 1;

  const topPadding = (terminal.getHeight() - totalContentHeight) / 2;
  terminal.writeLine('\n'.repeat(topPadding));
  terminal.writeLine(chalk.bold(banner
    .split("\n")
    .map(line => terminal.centerText(line))
    .join("\n")))
  terminal.writeLine(chalk.bold(banner2
    .split("\n")
    .map(line => terminal.centerText(line))
    .join("\n")))

  terminal.writeLine(chalk.cyanBright(terminal.centerText('A Gamified Interview Simulator for Developers')));
}
