import { EvaluationResult, ConceptMatch } from '../types/evaluation';
import { Question } from '../types/question';
import { EvaluationRubric } from '../types/evaluation';

export class BasicEvaluator {
  public evaluate(
    question: Question,
    userAnswer: string,
    rubric: EvaluationRubric
  ): EvaluationResult {
    const conceptMatches = this.matchConcepts(question.expectedConcepts, userAnswer);
    const conceptScore = this.calculateConceptScore(conceptMatches, rubric);
    const completenessScore = this.calculateCompletenessScore(userAnswer, rubric);
    const clarityScore = this.calculateClarityScore(userAnswer, rubric);

    const totalScore = Math.round(conceptScore + completenessScore + clarityScore);
    const accuracy = this.calculateAccuracy(conceptMatches);
    
    const correctConcepts = conceptMatches
      .filter(cm => cm.found)
      .map(cm => cm.concept);
    
    const missedConcepts = conceptMatches
      .filter(cm => !cm.found)
      .map(cm => cm.concept);

    return {
      score: totalScore,
      maxScore: rubric.maxScore,
      xpEarned: 0, // Calculated separately by scoring system
      accuracy,
      correctConcepts,
      missedConcepts,
      feedback: this.generateFeedback(totalScore, correctConcepts, missedConcepts)
    };
  }

  private matchConcepts(expectedConcepts: string[], userAnswer: string): ConceptMatch[] {
    const answerLower = userAnswer.toLowerCase();
    
    return expectedConcepts.map(concept => {
      const conceptLower = concept.toLowerCase();
      const found = answerLower.includes(conceptLower);
      
      return {
        concept,
        found,
        confidence: found ? 1.0 : 0.0
      };
    });
  }

  private calculateConceptScore(matches: ConceptMatch[], rubric: EvaluationRubric): number {
    const totalConcepts = matches.length;
    if (totalConcepts === 0) return 0;

    const matchedConcepts = matches.filter(m => m.found).length;
    return (matchedConcepts / totalConcepts) * rubric.maxScore * rubric.conceptWeight;
  }

  private calculateCompletenessScore(answer: string, rubric: EvaluationRubric): number {
    const wordCount = answer.trim().split(/\s+/).length;
    
    let score = 0;
    if (wordCount >= 100) score = 1.0;
    else if (wordCount >= 50) score = 0.8;
    else if (wordCount >= 25) score = 0.5;
    else score = 0.3;

    return score * rubric.maxScore * rubric.completenessWeight;
  }

  private calculateClarityScore(answer: string, rubric: EvaluationRubric): number {
    const hasGoodStructure = answer.includes('\n') || answer.length > 100;
    const hasExamples = /example|for instance|such as/i.test(answer);
    
    let score = 0.5;
    if (hasGoodStructure) score += 0.25;
    if (hasExamples) score += 0.25;

    return score * rubric.maxScore * rubric.clarityWeight;
  }

  private calculateAccuracy(matches: ConceptMatch[]): number {
    if (matches.length === 0) return 0;
    
    const correctCount = matches.filter(m => m.found).length;
    return Math.round((correctCount / matches.length) * 100);
  }

  private generateFeedback(score: number, correct: string[], missed: string[]): string {
    let feedback = '';

    if (score >= 80) {
      feedback = 'Excellent answer! You covered the key concepts well.';
    } else if (score >= 60) {
      feedback = 'Good effort! You got most of the important points.';
    } else if (score >= 40) {
      feedback = 'Decent attempt, but there\'s room for improvement.';
    } else {
      feedback = 'Keep practicing! Review the concepts and try again.';
    }

    if (missed.length > 0) {
      feedback += ` You missed: ${missed.join(', ')}.`;
    }

    return feedback;
  }
}
