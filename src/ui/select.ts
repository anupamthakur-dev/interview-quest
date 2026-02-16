import * as readline from 'readline';
import { terminal } from './terminal';
import chalk from 'chalk';
import { hideCursor, showCursor } from './screen';

export interface SelectOption {
  name: string;
  value: string;
  description?: string;
}

export interface SelectMenuOptions {
  message: string;
  options: SelectOption[];
  offset?: number;
}

// Track if emitKeypressEvents has been called
let keypressEventsInitialized = false;

/**
 * Custom select menu with arrow key navigation
 * @param options - Array of select options
 * @param offset - Vertical offset from top (for centering)
 * @returns Selected option value
 */
export async function selectMenu(
  options: SelectOption[],
  offset: number = 0
): Promise<string> {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    let isActive = true;

    // Hide cursor during menu navigation
    hideCursor();

    // Calculate max width for the menu box
    const maxOptionLength = Math.max(...options.map(opt => {
      const fullText = opt.description ? `${opt.name} ${opt.description}` : opt.name;
      return fullText.length;
    }));
    const menuWidth = Math.min(maxOptionLength + 6, 80); // +6 for indicator and padding
    const leftPadding = Math.floor((terminal.getWidth() - menuWidth) / 2);

    // Setup readline for keypress - only call once
    if (!keypressEventsInitialized) {
      readline.emitKeypressEvents(process.stdin);
      keypressEventsInitialized = true;
    }
    
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    const render = () => {
      // Move cursor to offset position
      const startRow = offset > 0 ? offset : 1;
      process.stdout.write(`\x1B[${startRow};1H`);
      
      // Clear from cursor down
      process.stdout.write('\x1B[J');

      // Render each option (left-aligned within centered menu)
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        const prefix = isSelected ? '❯' : ' ';
        const style = isSelected ? '\x1B[36m\x1B[1m' : '\x1B[0m'; // Cyan + Bold for selected
        const reset = '\x1B[0m';
        
        let line = `${prefix} ${option.name}`;
        if (option.description && !isSelected) {
          line += ` \x1B[90m${option.description}${reset}`;
        }
        
        // Left-align within the centered menu
        const padding = ' '.repeat(leftPadding);
        process.stdout.write(padding + style + line + reset + '\n');
      });

      // Add hint at bottom (centered)
      const hint = chalk.dim('↑↓ Navigate • Enter Select • Esc/Ctrl+C Exit')
    
      terminal.writeLine('\n')
      terminal.writeLine(terminal.centerText(hint))
    };

    const cleanup = () => {
      isActive = false;
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.removeListener('keypress', onKeypress);
      
      // Pause stdin to prevent buffered input from leaking
      process.stdin.pause();
      
      // Keep cursor hidden after menu - will be shown when input is needed
      hideCursor();
    };

    const onKeypress = (str: string, key: any) => {
      if (!isActive) return;

      if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
        cleanup();
        const homeOption = options.find(opt => opt.value === 'home');
        setTimeout(() => resolve(homeOption ? homeOption.value : options[0].value), 50);
        return;
      }

      if (key.name === 'up' || key.name === 'k') {
        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        render();
      } else if (key.name === 'down' || key.name === 'j') {
        selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        render();
      } else if (key.name === 'return' || key.name === 'enter') {
        cleanup();
        
        // Clear the menu
        process.stdout.write('\x1B[2J\x1B[H');
        
        // Add delay to ensure cleanup completes before resolving
        setTimeout(() => resolve(options[selectedIndex].value), 50);
      }
    };

    process.stdin.on('keypress', onKeypress);
    
    // Resume stdin for this menu
    process.stdin.resume();
    
    // Initial render
    render();
  });
}

/**
 * Show select menu with message
 */
export async function showSelectMenu(config: SelectMenuOptions): Promise<string> {
  terminal.clear();
  
  // Calculate offset for centering
  const menuHeight = config.options.length + 4; // options + message + hints
  const offset = Math.max(2, Math.floor((terminal.getHeight() - menuHeight) / 2));
  
  // Show message
  const messagePadding = ' '.repeat(Math.floor((terminal.getWidth() - config.message.length) / 2));
  process.stdout.write('\x1B[' + offset + ';1H');
  process.stdout.write(messagePadding + '\x1B[1m' + config.message + '\x1B[0m\n\n');
  
  // Show menu
  const result = await selectMenu(config.options, offset + 2);
  
  return result;
}
