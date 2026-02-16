import { Round } from '../types/game';
import { Question } from '../types/question';

export class RoundManager {
  public createRound(
    roundNumber: number,
    question: Question
  ): Omit<Round, 'userAnswer' | 'timeElapsed' | 'score' | 'xpEarned' | 'correctConcepts' | 'feedback'> {
    return {
      roundNumber,
      category: question.category,
      question: question.text,
      timeLimit: question.timeLimit
    };
  }

  public completeRound(
    round: Omit<Round, 'userAnswer' | 'timeElapsed' | 'score' | 'xpEarned' | 'correctConcepts' | 'feedback'>,
    userAnswer: string,
    timeElapsed: number,
    score: number,
    xpEarned: number,
    correctConcepts: string[],
    feedback: string
  ): Round {
    return {
      ...round,
      userAnswer,
      timeElapsed,
      score,
      xpEarned,
      correctConcepts,
      feedback
    };
  }

  public calculateTimeBonus(timeElapsed: number, timeLimit: number): number {
    if (timeLimit === 0) return 0;
    
    const percentageUsed = timeElapsed / timeLimit;
    
    if (percentageUsed < 0.5) {
      return 20; // Fast answer bonus
    } else if (percentageUsed < 0.75) {
      return 10; // Good timing bonus
    }
    
    return 0;
  }

  public displayRoundSummary(round: Round): string {
    const header = `\n${'='.repeat(60)}\n`;
    const footer = `${'='.repeat(60)}\n`;
    
    let summary = header;
    summary += `Round ${round.roundNumber} Summary\n`;
    summary += `Category: ${round.category}\n`;
    summary += `Score: ${round.score}/100\n`;
    summary += `XP Earned: ${round.xpEarned}\n`;
    summary += `Time: ${round.timeElapsed}s / ${round.timeLimit}s\n`;
    summary += `\nConcepts Identified: ${round.correctConcepts.join(', ') || 'None'}\n`;
    summary += `\nFeedback: ${round.feedback}\n`;
    summary += footer;
    
    return summary;
  }
}
