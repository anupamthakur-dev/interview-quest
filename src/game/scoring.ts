import { EvaluationResult } from '../types/evaluation';

export class ScoringSystem {
  private readonly MAX_SCORE = 100;
  private readonly BASE_XP = 50;

  public calculateScore(evaluation: EvaluationResult, timeBonus: number = 0): number {
    const baseScore = evaluation.score;
    const bonusScore = timeBonus;
    
    return Math.min(baseScore + bonusScore, this.MAX_SCORE);
  }

  public calculateXP(score: number, difficulty: 'easy' | 'medium' | 'hard'): number {
    const difficultyMultiplier = {
      easy: 1.0,
      medium: 1.5,
      hard: 2.0
    };

    const multiplier = difficultyMultiplier[difficulty];
    const xp = Math.floor((score / this.MAX_SCORE) * this.BASE_XP * multiplier);
    
    return xp;
  }

  public calculateAccuracy(correctConcepts: number, totalConcepts: number): number {
    if (totalConcepts === 0) return 0;
    return Math.round((correctConcepts / totalConcepts) * 100);
  }

  public assignGrade(score: number): string {
    if (score >= 90) return 'A+ Excellent';
    if (score >= 80) return 'A Good';
    if (score >= 70) return 'B+ Above Average';
    if (score >= 60) return 'B Average';
    if (score >= 50) return 'C Needs Improvement';
    return 'D Keep Practicing';
  }

  public calculateLevelFromXP(totalXP: number): number {
    return Math.floor(totalXP / 500) + 1;
  }

  public getXPForNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevelFromXP(currentXP);
    const xpForNextLevel = currentLevel * 500;
    return xpForNextLevel - currentXP;
  }
}
