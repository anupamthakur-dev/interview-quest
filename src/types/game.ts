export interface GameState {
  mode: GameMode;
  currentRound: number;
  totalRounds: number;
  score: number;
  xp: number;
  accuracy: number;
  difficulty: DifficultyLevel;
  sessionStartTime: Date;
  isActive: boolean;
}

export type GameMode = 'guess-output' | 'interview-mode' | 'practice-grounds';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'adaptive';

export interface Round {
  roundNumber: number;
  category: string;
  question: string;
  userAnswer: string;
  timeLimit: number;
  timeElapsed: number;
  score: number;
  xpEarned: number;
  correctConcepts: string[];
  feedback: string;
}
