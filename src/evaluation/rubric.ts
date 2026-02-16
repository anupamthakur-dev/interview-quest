import { EvaluationRubric } from '../types/evaluation';

export const DEFAULT_RUBRIC: EvaluationRubric = {
  conceptWeight: 0.6,      // 60% - Identifying key concepts
  completenessWeight: 0.25, // 25% - Answer completeness
  clarityWeight: 0.15,     // 15% - Clarity and structure
  maxScore: 100,
  xpMultiplier: 1.0
};

export const INTERVIEW_MODE_RUBRIC: EvaluationRubric = {
  conceptWeight: 0.5,
  completenessWeight: 0.3,
  clarityWeight: 0.2,
  maxScore: 100,
  xpMultiplier: 1.5
};

export const PRACTICE_MODE_RUBRIC: EvaluationRubric = {
  conceptWeight: 0.7,
  completenessWeight: 0.2,
  clarityWeight: 0.1,
  maxScore: 100,
  xpMultiplier: 0.8
};

export function getRubricForMode(mode: string): EvaluationRubric {
  switch (mode) {
    case 'interview-mode':
      return INTERVIEW_MODE_RUBRIC;
    case 'practice-grounds':
      return PRACTICE_MODE_RUBRIC;
    default:
      return DEFAULT_RUBRIC;
  }
}
