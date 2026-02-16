import { GameState, GameMode, Round } from '../types/game';
import { Question } from '../types/question';

export class GameEngine {
  private state: GameState;

  constructor(mode: GameMode) {
    this.state = this.initializeState(mode);
  }

  private initializeState(mode: GameMode): GameState {
    const roundsConfig = {
      'guess-output': 999,
      'interview-mode': 10,
      'practice-grounds': 1
    };

    return {
      mode,
      currentRound: 0,
      totalRounds: roundsConfig[mode],
      score: 0,
      xp: 0,
      accuracy: 0,
      difficulty: 'medium',
      sessionStartTime: new Date(),
      isActive: true
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public startRound(): void {
    if (this.state.currentRound < this.state.totalRounds) {
      this.state.currentRound += 1;
    }
  }

  public completeRound(round: Round): void {
    this.state.score += round.score;
    this.state.xp += round.xpEarned;
    
    // Update accuracy
    const totalRounds = this.state.currentRound;
    this.state.accuracy = (this.state.score / (totalRounds * 100)) * 100;
  }

  public isGameOver(): boolean {
    return this.state.currentRound >= this.state.totalRounds;
  }

  public endGame(): void {
    this.state.isActive = false;
  }

  public getCurrentRound(): number {
    return this.state.currentRound;
  }

  public getTotalRounds(): number {
    return this.state.totalRounds;
  }
}
