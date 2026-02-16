import { EvaluationResult } from '../types/evaluation';

export class FeedbackGenerator {
  public generateDetailedFeedback(result: EvaluationResult): string {
    let feedback = '\n';
    feedback += this.getPerformanceBanner(result.score);
    feedback += '\n\n';
    feedback += `📊 Score: ${result.score}/${result.maxScore}\n`;
    feedback += `🎯 Accuracy: ${result.accuracy}%\n`;
    feedback += `⭐ XP Earned: ${result.xpEarned}\n`;
    feedback += '\n';

    if (result.correctConcepts.length > 0) {
      feedback += `✅ Concepts Identified:\n`;
      result.correctConcepts.forEach(concept => {
        feedback += `   • ${concept}\n`;
      });
      feedback += '\n';
    }

    if (result.missedConcepts.length > 0) {
      feedback += `❌ Missed Concepts:\n`;
      result.missedConcepts.forEach(concept => {
        feedback += `   • ${concept}\n`;
      });
      feedback += '\n';
    }

    feedback += `💬 Feedback: ${result.feedback}\n`;

    if (result.suggestions && result.suggestions.length > 0) {
      feedback += `\n💡 Suggestions:\n`;
      result.suggestions.forEach(suggestion => {
        feedback += `   • ${suggestion}\n`;
      });
    }

    return feedback;
  }

  public generateQuickFeedback(result: EvaluationResult): string {
    const grade = this.getGrade(result.score);
    const emoji = this.getEmoji(result.score);
    
    return `${emoji} ${grade} | Score: ${result.score}/100 | XP: +${result.xpEarned}`;
  }

  private getPerformanceBanner(score: number): string {
    if (score >= 90) return '🏆 OUTSTANDING PERFORMANCE!';
    if (score >= 75) return '🌟 GREAT JOB!';
    if (score >= 60) return '👍 GOOD EFFORT!';
    if (score >= 40) return '📈 KEEP IMPROVING!';
    return '💪 KEEP PRACTICING!';
  }

  private getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'D';
  }

  private getEmoji(score: number): string {
    if (score >= 90) return '🏆';
    if (score >= 75) return '🌟';
    if (score >= 60) return '👍';
    if (score >= 40) return '📈';
    return '💪';
  }

  public generateProgressMessage(currentRound: number, totalRounds: number): string {
    const percentage = Math.round((currentRound / totalRounds) * 100);
    const bar = this.createProgressBar(percentage);
    
    return `\nProgress: ${bar} ${currentRound}/${totalRounds} (${percentage}%)\n`;
  }

  private createProgressBar(percentage: number, length: number = 20): string {
    const filled = Math.round((percentage / 100) * length);
    const empty = length - filled;
    
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}
