export interface User {
  id: string;
  username?: string;
  totalXP: number;
  level: number;
  sessionsPlayed: number;
  questionsAnswered: number;
  averageAccuracy: number;
  createdAt: Date;
  lastPlayedAt?: Date;
}

export interface UserStats {
  totalScore: number;
  totalXP: number;
  questionsAnswered: number;
  questionsCorrect: number;
  averageAccuracy: number;
  currentStreak: number;
  bestStreak: number;
  categoryStats: CategoryStats;
}

export interface CategoryStats {
  [category: string]: {
    questionsAnswered: number;
    accuracy: number;
    averageScore: number;
  };
}

export interface Session {
  id: string;
  userId: string;
  mode: string;
  startTime: Date;
  endTime?: Date;
  rounds: number;
  score: number;
  xpEarned: number;
  accuracy: number;
}
