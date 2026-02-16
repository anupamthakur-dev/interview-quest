export interface MenuOption {
  name: string;
  value: string;
  description?: string;
}

export const MENU_OPTIONS: MenuOption[] = [
  {
    name: 'Quick Quest',
    value: 'quick-quest',
    description: 'Fast-paced 5-question challenge'
  },
  {
    name: 'Interview Mode',
    value: 'interview-mode',
    description: 'Realistic interview simulation'
  },
  {
    name: 'Practice Grounds',
    value: 'practice-grounds',
    description: 'Practice without pressure'
  },
  {
    name: 'Exit',
    value: 'exit',
    description: 'Quit InterviewQuest'
  }
];

export const APP_NAME = 'InterviewQuest';
export const APP_VERSION = '1.0.0';
export const CLEAR_SCREEN = '\x1Bc';
