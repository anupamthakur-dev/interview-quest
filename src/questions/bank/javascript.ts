import { Question } from '../../types/question';

export const javascriptQuestions: Question[] = [
  {
    id: 'js-001',
    category: 'javascript',
    difficulty: 'easy',
    text: 'What is the difference between `let`, `const`, and `var` in JavaScript?',
    expectedConcepts: ['block scope', 'hoisting', 'reassignment', 'temporal dead zone'],
    timeLimit: 120,
    hints: ['Think about scope', 'Consider reassignment']
  },
  {
    id: 'js-002',
    category: 'javascript',
    difficulty: 'easy',
    text: 'Explain what a closure is in JavaScript with an example.',
    expectedConcepts: ['closure', 'scope', 'function', 'lexical environment'],
    timeLimit: 120,
    hints: ['Functions can access outer scope']
  },
  {
    id: 'js-003',
    category: 'javascript',
    difficulty: 'medium',
    text: 'What is event delegation and why is it useful?',
    expectedConcepts: ['event bubbling', 'event propagation', 'performance', 'dynamic elements'],
    timeLimit: 150,
    hints: ['Think about event propagation', 'Performance benefits']
  },
  {
    id: 'js-004',
    category: 'javascript',
    difficulty: 'medium',
    text: 'Explain the difference between `==` and `===` in JavaScript.',
    expectedConcepts: ['type coercion', 'strict equality', 'loose equality', 'type conversion'],
    timeLimit: 120,
    hints: ['One checks type, one doesn\'t']
  },
  {
    id: 'js-005',
    category: 'javascript',
    difficulty: 'hard',
    text: 'What is the event loop in JavaScript? How does it work with the call stack and callback queue?',
    expectedConcepts: ['event loop', 'call stack', 'callback queue', 'microtask', 'macrotask', 'asynchronous'],
    timeLimit: 180,
    hints: ['Single-threaded execution', 'Asynchronous operations']
  },
  {
    id: 'js-006',
    category: 'javascript',
    difficulty: 'hard',
    text: 'Explain prototypal inheritance in JavaScript. How does it differ from classical inheritance?',
    expectedConcepts: ['prototype', 'prototype chain', '__proto__', 'constructor', 'inheritance'],
    timeLimit: 180,
    hints: ['Objects inherit from objects', 'Prototype chain']
  }
];
