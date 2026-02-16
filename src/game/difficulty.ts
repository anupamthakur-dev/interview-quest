import { DifficultyLevel } from '../types/game';

export class DifficultyAdapter {
  private performanceHistory: number[] = [];
  private readonly HISTORY_SIZE = 5;

  public addPerformance(score: number): void {
    this.performanceHistory.push(score);
    
    if (this.performanceHistory.length > this.HISTORY_SIZE) {
      this.performanceHistory.shift();
    }
  }

  public getNextDifficulty(currentDifficulty: DifficultyLevel): DifficultyLevel {
    if (this.performanceHistory.length < 3) {
      return currentDifficulty;
    }

    const avgScore = this.getAveragePerformance();

    if (avgScore >= 85) {
      return this.increaseDifficulty(currentDifficulty);
    } else if (avgScore <= 40) {
      return this.decreaseDifficulty(currentDifficulty);
    }

    return currentDifficulty;
  }

  private getAveragePerformance(): number {
    if (this.performanceHistory.length === 0) return 0;
    
    const sum = this.performanceHistory.reduce((acc, score) => acc + score, 0);
    return sum / this.performanceHistory.length;
  }

  private increaseDifficulty(current: DifficultyLevel): DifficultyLevel {
    const progression: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    const currentIndex = progression.indexOf(current === 'adaptive' ? 'medium' : current);
    
    if (currentIndex < progression.length - 1) {
      return progression[currentIndex + 1];
    }
    
    return current;
  }

  private decreaseDifficulty(current: DifficultyLevel): DifficultyLevel {
    const progression: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    const currentIndex = progression.indexOf(current === 'adaptive' ? 'medium' : current);
    
    if (currentIndex > 0) {
      return progression[currentIndex - 1];
    }
    
    return current;
  }

  public reset(): void {
    this.performanceHistory = [];
  }

  public getPerformanceTrend(): 'improving' | 'declining' | 'stable' {
    if (this.performanceHistory.length < 3) return 'stable';

    const recent = this.performanceHistory.slice(-3);
    const older = this.performanceHistory.slice(0, -3);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    if (recentAvg > olderAvg + 10) return 'improving';
    if (recentAvg < olderAvg - 10) return 'declining';
    
    return 'stable';
  }
}
