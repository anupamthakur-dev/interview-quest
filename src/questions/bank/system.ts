import { Question } from '../../types/question';

export const systemQuestions: Question[] = [
  {
    id: 'sys-001',
    category: 'system-design',
    difficulty: 'medium',
    text: 'What is load balancing and why is it important in distributed systems?',
    expectedConcepts: ['load balancing', 'distributed systems', 'scalability', 'availability', 'algorithms'],
    timeLimit: 150,
    hints: ['Distribution of traffic', 'Scalability']
  },
  {
    id: 'sys-002',
    category: 'system-design',
    difficulty: 'medium',
    text: 'Explain the difference between horizontal and vertical scaling.',
    expectedConcepts: ['horizontal scaling', 'vertical scaling', 'scalability', 'resources'],
    timeLimit: 120,
    hints: ['Scale out vs scale up', 'Adding machines vs resources']
  },
  {
    id: 'sys-003',
    category: 'system-design',
    difficulty: 'hard',
    text: 'What is CAP theorem and how does it apply to distributed databases?',
    expectedConcepts: ['CAP theorem', 'consistency', 'availability', 'partition tolerance', 'trade-offs'],
    timeLimit: 180,
    hints: ['Three guarantees', 'Pick two']
  },
  {
    id: 'sys-004',
    category: 'system-design',
    difficulty: 'hard',
    text: 'How would you design a URL shortening service like bit.ly?',
    expectedConcepts: ['hashing', 'database', 'scalability', 'base62', 'collision handling', 'distributed'],
    timeLimit: 240,
    hints: ['Hash generation', 'Storage', 'Scalability']
  }
];
