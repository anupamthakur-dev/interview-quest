export interface EvaluationResult {
  score: number;
  maxScore: number;
  xpEarned: number;
  accuracy: number;
  correctConcepts: string[];
  missedConcepts: string[];
  feedback: string;
  detailedFeedback?: string;
  suggestions?: string[];
}

export interface EvaluationRubric {
  conceptWeight: number;
  completenessWeight: number;
  clarityWeight: number;
  maxScore: number;
  xpMultiplier: number;
}

export interface ConceptMatch {
  concept: string;
  found: boolean;
  confidence: number;
}

export type EvaluationMode = 'basic' | 'copilot' | 'detailed';
