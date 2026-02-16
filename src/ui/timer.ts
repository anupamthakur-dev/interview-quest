export class Timer {
  private startTime: number = 0;
  private endTime: number = 0;
  private isRunning: boolean = false;

  public start(): void {
    this.startTime = Date.now();
    this.isRunning = true;
  }

  public stop(): number {
    if (!this.isRunning) return 0;
    
    this.endTime = Date.now();
    this.isRunning = false;
    
    return this.getElapsed();
  }

  public getElapsed(): number {
    if (this.isRunning) {
      return Math.floor((Date.now() - this.startTime) / 1000);
    }
    
    return Math.floor((this.endTime - this.startTime) / 1000);
  }

  public reset(): void {
    this.startTime = 0;
    this.endTime = 0;
    this.isRunning = false;
  }

  public isActive(): boolean {
    return this.isRunning;
  }
}

export function formatTimerDisplay(seconds: number, limit: number): string {
  const remaining = Math.max(0, limit - seconds);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  
  const color = remaining < 30 ? '🔴' : remaining < 60 ? '🟡' : '🟢';
  
  return `${color} ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
