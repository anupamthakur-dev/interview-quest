export interface GuessGameState {
  lives: number;
  maxLives: number;
  currentStreak: number;
  totalCorrect: number;
  totalAttempts: number;
  difficulty: 'easy' | 'medium' | 'hard';
  technology: string;
  score: number;
}

export interface CodeChallenge {
  code: string;
  expectedOutput: string;
  difficulty: 'easy' | 'medium' | 'hard';
  technology: string;
  explanation?: string;
}
