import { GameState, GameMode, DifficultyLevel } from '../types/game';

export class StateManager {
  private state: GameState | null = null;

  public createState(mode: GameMode): GameState {
    this.state = {
      mode,
      currentRound: 0,
      totalRounds: this.getRoundsForMode(mode),
      score: 0,
      xp: 0,
      accuracy: 0,
      difficulty: 'medium',
      sessionStartTime: new Date(),
      isActive: true
    };

    return this.state;
  }

  public getState(): GameState | null {
    return this.state ? { ...this.state } : null;
  }

  public updateState(updates: Partial<GameState>): void {
    if (this.state) {
      this.state = { ...this.state, ...updates };
    }
  }

  public resetState(): void {
    this.state = null;
  }

  private getRoundsForMode(mode: GameMode): number {
    const rounds = {
      'guess-output': 999,
      'interview-mode': 10,
      'practice-grounds': 1
    };
    return rounds[mode];
  }

  public incrementRound(): void {
    if (this.state) {
      this.state.currentRound += 1;
    }
  }

  public updateScore(points: number): void {
    if (this.state) {
      this.state.score += points;
    }
  }

  public updateXP(xp: number): void {
    if (this.state) {
      this.state.xp += xp;
    }
  }

  public updateAccuracy(): void {
    if (this.state && this.state.currentRound > 0) {
      this.state.accuracy = (this.state.score / (this.state.currentRound * 100)) * 100;
    }
  }

  public adjustDifficulty(performance: number): void {
    if (!this.state) return;

    if (performance >= 80) {
      this.state.difficulty = 'hard';
    } else if (performance >= 50) {
      this.state.difficulty = 'medium';
    } else {
      this.state.difficulty = 'easy';
    }
  }
}
