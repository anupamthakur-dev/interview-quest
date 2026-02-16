import chalk from 'chalk';
import { terminal } from './terminal';

export function renderHeader(mode?: string): void {
  const width = terminal.getWidth();
  
  if (mode) {
    const modeText = getModeText(mode);
    
    terminal.writeLine(' ');
    terminal.writeLine(chalk.bold(terminal.centerText(modeText)));
  } else {
    // Empty line for spacing when no mode
    terminal.writeLine('');
  }
  
  // Bottom border - single line with gray/dim color, adjusted to terminal width
  terminal.writeLine(chalk.dim('–'.repeat(terminal.getContentWidth())));
  terminal.writeLine('');
}

function getModeText(mode: string): string {
  const modeMap: Record<string, string> = {
    'guess-output': '🎯 GUESS THE OUTPUT MODE',
    'interview-mode': '💼 INTERVIEW MODE',
    'practice-grounds': '🎮 PRACTICE GROUNDS',
    'main-menu': '🎮 INTERVIEWQUEST'
  };
  
  return modeMap[mode] || mode.toUpperCase();
}
