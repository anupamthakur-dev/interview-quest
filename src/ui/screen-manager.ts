import { terminal } from './terminal';

export class ScreenManager {
  private static instance: ScreenManager;
  private screenStack: Map<string, string[]> = new Map();
  private currentScreenId: string | null = null;

  private constructor() {}

  public static getInstance(): ScreenManager {
    if (!ScreenManager.instance) {
      ScreenManager.instance = new ScreenManager();
    }
    return ScreenManager.instance;
  }

  public beginScreen(screenId: string): void {
    // Save current screen before starting new one
    if (this.currentScreenId) {
      this.saveCurrentScreen();
    }

    this.currentScreenId = screenId;
    terminal.clearContent();
  }

  public endScreen(): void {
    if (this.currentScreenId) {
      this.screenStack.delete(this.currentScreenId);
      this.currentScreenId = null;
    }
  }

  public saveCurrentScreen(): void {
    if (this.currentScreenId) {
      const content = terminal.getContent();
      this.screenStack.set(this.currentScreenId, content);
    }
  }

  public restoreScreen(screenId: string): boolean {
    const content = this.screenStack.get(screenId);
    if (content) {
      this.currentScreenId = screenId;
      terminal.restoreContent(content);
      return true;
    }
    return false;
  }

  public refreshCurrentScreen(): void {
    if (this.currentScreenId) {
      const content = terminal.getContent();
      terminal.restoreContent(content);
    }
  }
}

export const screenManager = ScreenManager.getInstance();
