export const AVAILABLE_TOPICS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'Go',
  'Rust',
  'Algorithms',
  'Data Structures',
  'System Design',
  'Databases',
  'AWS',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'REST APIs',
  'Git',
  'Testing',
  'Security'
] as const;

export type AvailableTopic = typeof AVAILABLE_TOPICS[number];

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
