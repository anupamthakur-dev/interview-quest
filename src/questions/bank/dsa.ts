import { Question } from '../../types/question';

export const dsaQuestions: Question[] = [
  {
    id: 'dsa-001',
    category: 'dsa',
    difficulty: 'easy',
    text: 'What is the time complexity of accessing an element in an array by index?',
    expectedConcepts: ['O(1)', 'constant time', 'direct access', 'index'],
    timeLimit: 90,
    hints: ['Direct access', 'No iteration needed']
  },
  {
    id: 'dsa-002',
    category: 'dsa',
    difficulty: 'easy',
    text: 'Explain the difference between a stack and a queue.',
    expectedConcepts: ['LIFO', 'FIFO', 'stack', 'queue', 'operations'],
    timeLimit: 120,
    hints: ['Order of operations', 'Last In First Out vs First In First Out']
  },
  {
    id: 'dsa-003',
    category: 'dsa',
    difficulty: 'medium',
    text: 'What is a hash table and what is its average time complexity for insertion and lookup?',
    expectedConcepts: ['hash table', 'hash function', 'O(1)', 'collision', 'buckets'],
    timeLimit: 150,
    hints: ['Key-value pairs', 'Fast lookups']
  },
  {
    id: 'dsa-004',
    category: 'dsa',
    difficulty: 'medium',
    text: 'Explain binary search and its time complexity. When can it be used?',
    expectedConcepts: ['binary search', 'O(log n)', 'sorted array', 'divide and conquer'],
    timeLimit: 150,
    hints: ['Requires sorted data', 'Divide and conquer']
  },
  {
    id: 'dsa-005',
    category: 'dsa',
    difficulty: 'hard',
    text: 'Describe how a depth-first search (DFS) works on a graph. What data structure is typically used?',
    expectedConcepts: ['DFS', 'graph', 'stack', 'recursion', 'visited', 'backtracking'],
    timeLimit: 180,
    hints: ['Explores as deep as possible', 'Uses stack or recursion']
  },
  {
    id: 'dsa-006',
    category: 'dsa',
    difficulty: 'hard',
    text: 'What is dynamic programming? Explain with an example problem.',
    expectedConcepts: ['dynamic programming', 'memoization', 'overlapping subproblems', 'optimal substructure'],
    timeLimit: 180,
    hints: ['Avoid recomputation', 'Break down into subproblems']
  }
];
