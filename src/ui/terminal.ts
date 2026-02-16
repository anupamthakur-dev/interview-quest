import * as readline from 'readline';

const MIN_TERMINAL_WIDTH = 60;
const MIN_TERMINAL_HEIGHT = 20;

export class TerminalWrapper {
  private width: number;
  private height: number;
  private contentWidth: number;
  private leftPadding: number;
  private currentContent: string[] = [];
  private isShowingWarning: boolean = false;
  private onResizeCallback: (() => void) | null = null;

  constructor() {
    this.width = process.stdout.columns || 80;
    this.height = process.stdout.rows || 24;
    this.contentWidth = Math.min(100, this.width - 4);
    this.leftPadding = Math.floor((this.width - this.contentWidth) / 2);

    this.setupResizeHandler();
  }

  private setupResizeHandler(): void {
    process.stdout.on('resize', () => {
      const oldWidth = this.width;
      const oldValid = this.isTerminalSizeValid();
      
      this.width = process.stdout.columns || 80;
      this.height = process.stdout.rows || 24;
      
      const newValid = this.isTerminalSizeValid();
      
      if (!newValid && !this.isShowingWarning) {
        this.isShowingWarning = true;
        this.showResizeWarning();
      } else if (newValid && this.isShowingWarning) {
        // Terminal became valid again, restore content
        this.isShowingWarning = false;
        this.updateDimensions();
        this.rerender();
      } else if (newValid && !this.isShowingWarning && oldWidth !== this.width) {
        // Terminal resized while valid, adjust content
        this.updateDimensions();
        this.rerender();
      }
    });
  }

  private updateDimensions(): void {
    this.contentWidth = Math.min(100, this.width - 4);
    this.leftPadding = Math.floor((this.width - this.contentWidth) / 2);
  }

  private rerender(): void {
    if (this.currentContent.length > 0) {
      console.clear();
      this.currentContent.forEach(line => {
        const wrappedLines = this.wrapLine(line);
        wrappedLines.forEach(wrappedLine => {
          const padding = ' '.repeat(this.leftPadding);
          process.stdout.write(padding + wrappedLine + '\n');
        });
      });
    }
    
    if (this.onResizeCallback) {
      this.onResizeCallback();
    }
  }

  public setResizeCallback(callback: () => void): void {
    this.onResizeCallback = callback;
  }

  public clearResizeCallback(): void {
    this.onResizeCallback = null;
  }

  public isTerminalSizeValid(): boolean {
    return this.width >= MIN_TERMINAL_WIDTH && this.height >= MIN_TERMINAL_HEIGHT;
  }

  public showResizeWarning(): void {
    console.clear();
    const message = `⚠️  Terminal too small!`;
    const instructions = `Minimum size: ${MIN_TERMINAL_WIDTH}x${MIN_TERMINAL_HEIGHT}`;
    const current = `Current: ${this.width}x${this.height}`;
    const help = 'Please resize your terminal to continue.';

    const lines = [message, '', instructions, current, '', help];
    const top = Math.max(0, Math.floor((this.height - lines.length) / 2));

    for (let i = 0; i < top; i++) {
      console.log('');
    }

    lines.forEach(line => {
      const padding = Math.max(0, Math.floor((this.width - line.length) / 2));
      console.log(' '.repeat(padding) + line);
    });
  }

  public waitForValidSize(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isTerminalSizeValid()) {
        resolve();
        return;
      }

      this.showResizeWarning();

      const checkSize = () => {
        if (this.isTerminalSizeValid()) {
          process.stdout.off('resize', checkSize);
          resolve();
        } else {
          this.showResizeWarning();
        }
      };

      process.stdout.on('resize', checkSize);
    });
  }

  public write(text: string, persist: boolean = true): void {
    const lines = text.split('\n');
    lines.forEach(line => {
      if (persist) {
        this.currentContent.push(line);
      }
      const wrappedLines = this.wrapLine(line);
      wrappedLines.forEach(wrappedLine => {
        const padding = ' '.repeat(this.leftPadding);
        process.stdout.write(padding + wrappedLine + '\n');
      });
    });
  }

  public writeLine(text: string = '', persist: boolean = true): void {
    this.write(text, persist);
  }

  public writeRaw(text: string): void {
    process.stdout.write(text);
  }

  public centerText(text: string): string {
    const textPadding = Math.max(0, Math.floor((this.contentWidth - text.length) / 2));
    return ' '.repeat(textPadding) + text;
  }

  private wrapLine(line: string): string[] {
    if (line.length <= this.contentWidth) {
      return [line];
    }

    const words = line.split(' ');
    const wrappedLines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length <= this.contentWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          wrappedLines.push(currentLine);
        }
        currentLine = word;
      }
    });

    if (currentLine) {
      wrappedLines.push(currentLine);
    }

    return wrappedLines;
  }

  public clear(): void {
    console.clear();
    this.currentContent = [];
  }

  public clearContent(): void {
    this.currentContent = [];
  }

  public getContent(): string[] {
    return [...this.currentContent];
  }

  public restoreContent(content: string[]): void {
    this.currentContent = [...content];
    this.rerender();
  }

  public getContentWidth(): number {
    return this.contentWidth;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}

export const terminal = new TerminalWrapper();
