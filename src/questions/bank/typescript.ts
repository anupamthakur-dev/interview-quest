import { Question } from '../../types/question';

export const typescriptQuestions: Question[] = [
  {
    id: 'ts-001',
    category: 'typescript',
    difficulty: 'easy',
    text: 'What are the benefits of using TypeScript over JavaScript?',
    expectedConcepts: ['type safety', 'intellisense', 'compile-time errors', 'refactoring'],
    timeLimit: 120,
    hints: ['Think about development experience', 'Error detection']
  },
  {
    id: 'ts-002',
    category: 'typescript',
    difficulty: 'easy',
    text: 'Explain the difference between `interface` and `type` in TypeScript.',
    expectedConcepts: ['interface', 'type alias', 'declaration merging', 'union types', 'intersection'],
    timeLimit: 120,
    hints: ['Both define shapes', 'Some unique features']
  },
  {
    id: 'ts-003',
    category: 'typescript',
    difficulty: 'medium',
    text: 'What are generics in TypeScript and why are they useful?',
    expectedConcepts: ['generics', 'type parameters', 'reusability', 'type safety', 'constraints'],
    timeLimit: 150,
    hints: ['Reusable components', 'Type variables']
  },
  {
    id: 'ts-004',
    category: 'typescript',
    difficulty: 'medium',
    text: 'Explain the `unknown` type and how it differs from `any`.',
    expectedConcepts: ['unknown', 'any', 'type safety', 'type narrowing', 'type checking'],
    timeLimit: 120,
    hints: ['Safety difference', 'Type checking required']
  },
  {
    id: 'ts-005',
    category: 'typescript',
    difficulty: 'hard',
    text: 'What are conditional types in TypeScript? Provide an example use case.',
    expectedConcepts: ['conditional types', 'infer', 'distributive', 'mapped types', 'utility types'],
    timeLimit: 180,
    hints: ['Type-level if statements', 'Advanced type manipulation']
  }
];
