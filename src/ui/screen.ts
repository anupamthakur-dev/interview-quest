import { terminal } from './terminal';
import { renderHeader } from './header';

export function clearScreen(): void {
  terminal.clear();
  hideCursor(); // Hide cursor when clearing screen
}

export function moveCursor(x: number, y: number): void {
  process.stdout.write(`\x1B[${y};${x}H`);
}

export function hideCursor(): void {
  process.stdout.write('\x1B[?25l');
}

export function showCursor(): void {
  process.stdout.write('\x1B[?25h');
}

export async function setupScreen(mode?: string): Promise<void> {
  await terminal.waitForValidSize();
  clearScreen();
  hideCursor(); // Hide cursor by default
  // renderHeader(mode);
}
