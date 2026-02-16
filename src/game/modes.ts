import { GameMode } from '../types/game';

export interface ModeConfig {
  name: string;
  description: string;
  rounds: number;
  timePerQuestion: number;
  evaluationMode: 'basic' | 'copilot' | 'detailed';
  allowHints: boolean;
  adaptiveDifficulty: boolean;
}

export const MODE_CONFIGS: Record<GameMode, ModeConfig> = {
  'guess-output': {
    name: 'Guess the Output',
    description: 'AI generates code, you guess the output',
    rounds: 999,
    timePerQuestion: 0,
    evaluationMode: 'copilot',
    allowHints: false,
    adaptiveDifficulty: true
  },
  'interview-mode': {
    name: 'Interview Mode',
    description: 'Realistic interview simulation with AI evaluation',
    rounds: 10,
    timePerQuestion: 180,
    evaluationMode: 'copilot',
    allowHints: true,
    adaptiveDifficulty: true
  },
  'practice-grounds': {
    name: 'Practice Grounds',
    description: 'Practice without pressure',
    rounds: 1,
    timePerQuestion: 0, // No time limit
    evaluationMode: 'detailed',
    allowHints: true,
    adaptiveDifficulty: false
  }
};

export function getModeConfig(mode: GameMode): ModeConfig {
  return MODE_CONFIGS[mode];
}

export function getModeDescription(mode: GameMode): string {
  return MODE_CONFIGS[mode].description;
}
