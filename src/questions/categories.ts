import { QuestionCategory } from '../types/question';

export const CATEGORIES: Record<QuestionCategory, string> = {
  'javascript': 'JavaScript Fundamentals',
  'typescript': 'TypeScript & Types',
  'dsa': 'Data Structures & Algorithms',
  'system-design': 'System Design',
  'general': 'General Programming'
};

export function getCategoryName(category: QuestionCategory): string {
  return CATEGORIES[category] || category;
}

export function getAllCategories(): QuestionCategory[] {
  return Object.keys(CATEGORIES) as QuestionCategory[];
}

export function getCategoryDescription(category: QuestionCategory): string {
  const descriptions: Record<QuestionCategory, string> = {
    'javascript': 'Core JavaScript concepts, ES6+, and best practices',
    'typescript': 'TypeScript features, type system, and advanced patterns',
    'dsa': 'Common data structures, algorithms, and complexity analysis',
    'system-design': 'Scalability, distributed systems, and architecture',
    'general': 'General programming concepts and best practices'
  };
  
  return descriptions[category] || '';
}
