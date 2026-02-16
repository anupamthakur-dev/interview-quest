export interface AppConfig {
  name: string;
  version: string;
  debug: boolean;
  questionsPerSession: {
    quickQuest: number;
    interviewMode: number;
    practiceGrounds: number;
  };
  timeouts: {
    easy: number;
    medium: number;
    hard: number;
  };
  scoring: {
    baseXP: number;
    maxScore: number;
    xpPerLevel: number;
  };
  features: {
    copilotEnabled: boolean;
    timerEnabled: boolean;
    hintsEnabled: boolean;
  };
}

export const config: AppConfig = {
  name: 'InterviewQuest',
  version: '1.0.0',
  debug: false,
  questionsPerSession: {
    quickQuest: 5,
    interviewMode: 10,
    practiceGrounds: 1
  },
  timeouts: {
    easy: 120,
    medium: 150,
    hard: 180
  },
  scoring: {
    baseXP: 50,
    maxScore: 100,
    xpPerLevel: 500
  },
  features: {
    copilotEnabled: false, // Will be enabled when gh copilot is detected
    timerEnabled: true,
    hintsEnabled: true
  }
};

export function getConfig(): AppConfig {
  return { ...config };
}

export function updateConfig(updates: Partial<AppConfig>): void {
  Object.assign(config, updates);
}
