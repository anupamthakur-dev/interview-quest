import { EvaluationResult } from '../types/evaluation';
import { Question } from '../types/question';
import { execSync } from 'child_process';
import { shouldUseCopilot } from '../config/environment';

// GitHub Copilot CLI integration for answer evaluation and question generation

export class CopilotEvaluator {
  private isAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  private checkAvailability(): void {
    // In dev mode, don't check for Copilot
    if (!shouldUseCopilot()) {
      this.isAvailable = false;
      return;
    }
    
    try {
      execSync('gh copilot --version', { stdio: 'ignore' });
      this.isAvailable = true;
    } catch {
      this.isAvailable = false;
    }
  }

  public isReady(): boolean {
    return this.isAvailable && shouldUseCopilot();
  }

  public async generateQuestion(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    questionNumber: number
  ): Promise<Question> {
    if (!this.isAvailable) {
      throw new Error('GitHub Copilot CLI is not available');
    }

    const prompt = this.buildQuestionGenerationPrompt(topic, difficulty, questionNumber);
    
    try {
      const response = await this.queryCopilot(prompt);
      return this.parseQuestionResponse(response, topic, difficulty, questionNumber);
    } catch (error) {
      throw new Error(`Failed to generate question: ${error}`);
    }
  }

  private buildQuestionGenerationPrompt(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    questionNumber: number
  ): string {
    const difficultyGuidance = {
      easy: 'Basic concepts, definitions, simple explanations. Suitable for beginners.',
      medium: 'Practical applications, comparisons, deeper understanding. Intermediate level.',
      hard: 'Advanced concepts, edge cases, system design, optimization. Expert level.'
    };

    return `You are an expert technical interviewer creating interview questions.

TOPIC: ${topic}
DIFFICULTY: ${difficulty}
GUIDANCE: ${difficultyGuidance[difficulty]}

TASK: Generate a single technical interview question.
Respond ONLY with a valid JSON object (no markdown, no extra text):

{
  "text": "The interview question (clear and specific)",
  "expectedConcepts": ["concept1", "concept2", "concept3", "concept4"],
  "hints": ["hint1", "hint2", "hint3"],
  "timeLimit": <120 for easy, 150 for medium, 180 for hard>
}

Requirements:
- Question should be realistic for a technical interview
- expectedConcepts: 4-6 key concepts the answer should cover
- hints: 3 progressive hints (subtle to more obvious)
- Make it relevant to ${topic}
- Difficulty level: ${difficulty}

Respond with ONLY the JSON object.`;
  }

  private parseQuestionResponse(
    response: string,
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    questionNumber: number
  ): Question {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Copilot response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        id: `ai-${topic}-${difficulty}-${questionNumber}-${Date.now()}`,
        category: this.mapTopicToCategory(topic),
        difficulty,
        text: parsed.text || 'Question generation failed',
        expectedConcepts: parsed.expectedConcepts || [],
        hints: parsed.hints || [],
        timeLimit: parsed.timeLimit || (difficulty === 'easy' ? 120 : difficulty === 'medium' ? 150 : 180)
      };
    } catch (error) {
      throw new Error(`Failed to parse question: ${error}`);
    }
  }

  private mapTopicToCategory(topic: string): any {
    const categoryMap: { [key: string]: string } = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'react': 'javascript',
      'node.js': 'javascript',
      'python': 'general',
      'java': 'general',
      'go': 'general',
      'rust': 'general',
      'algorithms': 'dsa',
      'data structures': 'dsa',
      'system design': 'system-design',
      'databases': 'system-design',
      'aws': 'system-design',
      'docker': 'system-design',
      'kubernetes': 'system-design'
    };

    const lowerTopic = topic.toLowerCase();
    return categoryMap[lowerTopic] || 'general';
  }

  public async evaluate(
    question: Question,
    userAnswer: string
  ): Promise<EvaluationResult> {
    if (!this.isAvailable) {
      throw new Error('GitHub Copilot CLI is not available.');
    }

    try {
      const prompt = this.buildEvaluationPrompt(question, userAnswer);
      const copilotResponse = await this.queryCopilot(prompt);
      
      return this.parseEvaluationResponse(copilotResponse, question);
    } catch (error) {
      throw new Error(`Copilot evaluation failed: ${error}`);
    }
  }

  private buildEvaluationPrompt(question: Question, userAnswer: string): string {
    return `You are an expert technical interviewer evaluating a candidate's answer.

QUESTION:
${question.text}

EXPECTED CONCEPTS TO COVER:
${question.expectedConcepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

CANDIDATE'S ANSWER:
${userAnswer}

TASK:
Evaluate this answer and respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "score": <number 0-100>,
  "correctConcepts": ["concept1", "concept2"],
  "missedConcepts": ["concept3", "concept4"],
  "feedback": "Brief constructive feedback in 2-3 sentences",
  "detailedFeedback": "Detailed analysis of strengths and weaknesses",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

Scoring criteria:
- 90-100: Exceptional answer covering all concepts with clear examples
- 75-89: Strong answer covering most concepts well
- 60-74: Good answer but missing some key concepts or clarity
- 40-59: Partial understanding, significant gaps
- 0-39: Poor understanding or incomplete answer

Respond with ONLY the JSON object.`;
  }

  private async queryCopilot(prompt: string): Promise<string> {
    try {
      const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');
      const command = `copilot -p "${escapedPrompt}"`;
      
      const response = execSync(command, {
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024 * 10,
        timeout: 30000
      });

      return response.trim();
    } catch (error) {
      throw new Error(`Failed to query Copilot: ${error}`);
    }
  }

  private parseEvaluationResponse(response: string, question: Question): EvaluationResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Copilot response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        score: Math.min(100, Math.max(0, parsed.score || 0)),
        maxScore: 100,
        xpEarned: 0,
        accuracy: this.calculateAccuracy(
          parsed.correctConcepts?.length || 0,
          question.expectedConcepts.length
        ),
        correctConcepts: parsed.correctConcepts || [],
        missedConcepts: parsed.missedConcepts || [],
        feedback: parsed.feedback || 'No feedback provided',
        detailedFeedback: parsed.detailedFeedback || '',
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      throw new Error(`Failed to parse Copilot response: ${error}`);
    }
  }

  private calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }

  /**
   * Generic method to ask Copilot a question
   */
  public async askCopilot(prompt: string): Promise<string> {
    try {
      // Use gh copilot with -p flag for non-interactive mode
      const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');
      const command = `gh copilot -p "${escapedPrompt}"`;
      const result = execSync(command, { 
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024 * 10,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      return result.trim();
    } catch (error) {
      throw new Error(`Copilot request failed: ${error}`);
    }
  }

  public async generateHint(question: Question, attemptNumber: number): Promise<string> {
    if (!this.isAvailable) {
      return question.hints?.[attemptNumber - 1] || 'No hints available';
    }

    const prompt = `Give a helpful hint for this interview question (hint ${attemptNumber}/3):

Question: ${question.text}

Provide a brief hint (1-2 sentences) that guides without giving away the answer. Respond with ONLY the hint text, no extra formatting.`;

    try {
      const hint = await this.queryCopilot(prompt);
      return hint || question.hints?.[attemptNumber - 1] || 'Think about the core concept';
    } catch {
      return question.hints?.[attemptNumber - 1] || 'Think about the core concept';
    }
  }
}
