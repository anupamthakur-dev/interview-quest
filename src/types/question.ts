export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  hints?: string[];
  expectedConcepts: string[];
  timeLimit: number;
}

export type QuestionCategory = 
  | 'javascript'
  | 'typescript'
  | 'dsa'
  | 'system-design'
  | 'general';

export interface QuestionBank {
  [category: string]: Question[];
}
