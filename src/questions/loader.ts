import { Question, QuestionCategory } from '../types/question';
import { javascriptQuestions } from './bank/javascript';
import { typescriptQuestions } from './bank/typescript';
import { dsaQuestions } from './bank/dsa';
import { systemQuestions } from './bank/system';

export class QuestionLoader {
  private questionBank: Map<QuestionCategory, Question[]>;

  constructor() {
    this.questionBank = new Map([
      ['javascript', javascriptQuestions],
      ['typescript', typescriptQuestions],
      ['dsa', dsaQuestions],
      ['system-design', systemQuestions]
    ]);
  }

  public getRandomQuestion(category?: QuestionCategory, difficulty?: 'easy' | 'medium' | 'hard'): Question | null {
    let questions: Question[];

    if (category) {
      questions = this.questionBank.get(category) || [];
    } else {
      questions = this.getAllQuestions();
    }

    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    if (questions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  public getQuestionById(id: string): Question | null {
    const allQuestions = this.getAllQuestions();
    return allQuestions.find(q => q.id === id) || null;
  }

  public getQuestionsByCategory(category: QuestionCategory): Question[] {
    return this.questionBank.get(category) || [];
  }

  public getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
    return this.getAllQuestions().filter(q => q.difficulty === difficulty);
  }

  private getAllQuestions(): Question[] {
    const allQuestions: Question[] = [];
    this.questionBank.forEach(questions => {
      allQuestions.push(...questions);
    });
    return allQuestions;
  }

  public getTotalQuestionCount(): number {
    return this.getAllQuestions().length;
  }

  public getCategoryCount(): number {
    return this.questionBank.size;
  }
}
