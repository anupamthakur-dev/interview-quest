import { terminal } from '../ui/terminal';
import { clearScreen } from '../ui/screen';
import { renderHeader } from '../ui/header';
import { selectDifficulty } from '../ui/input';
import { askContinue } from '../ui/menu-native';
import { CopilotEvaluator } from '../evaluation/copilot';
import { delay, sleep } from '../utils/delay';
import { GuessGameState, CodeChallenge } from '../types/guess-game';
import { openEditor } from '../ui/editor';
import { showPostGameMenu, PostGameChoice } from '../ui/post-game-menu';
import { shouldUseCopilot } from '../config/environment';
import * as readline from 'readline';
import {  getLanguageTheme, horiCenterFiglet} from '../utils/helper';
import chalk from 'chalk';
import { DevMode } from '../ui/devMode';

import { showCursor, hideCursor } from '../ui/screen';




const INITIAL_LIVES = 3;
const MAX_LIVES = 3;
const STREAK_FOR_DIFFICULTY_UP = 3;
const STREAK_FOR_LIFE_BONUS = 3;

// Fallback challenges if Copilot fails
const FALLBACK_CHALLENGES: Record<string, CodeChallenge[]> = {
  'JavaScript': [
    {
      code: 'let x = 5 + 3;\nconsole.log(x);',
      expectedOutput: '8',
      difficulty: 'easy',
      technology: 'JavaScript',
      explanation: 'Simple addition: 5 + 3 = 8'
    },
    {
      code: 'let arr = [1, 2, 3];\nconsole.log(arr.length);',
      expectedOutput: '3',
      difficulty: 'easy',
      technology: 'JavaScript',
      explanation: 'Array length property returns number of elements'
    },
    {
      code: 'console.log(typeof null);',
      expectedOutput: 'object',
      difficulty: 'medium',
      technology: 'JavaScript',
      explanation: 'typeof null returns "object" due to a historical bug in JavaScript'
    }
  ],
  'Python': [
    {
      code: 'x = 10\nprint(x * 2)',
      expectedOutput: '20',
      difficulty: 'easy',
      technology: 'Python',
      explanation: 'Simple multiplication: 10 * 2 = 20'
    },
    {
      code: 'print([1, 2, 3] + [4, 5])',
      expectedOutput: '[1, 2, 3, 4, 5]',
      difficulty: 'medium',
      technology: 'Python',
      explanation: 'List concatenation combines two lists'
    }
  ]
};

export async function playGuessTheOutput(selectedTech: string): Promise<PostGameChoice> {
  const copilot = new CopilotEvaluator();
  
  if (!copilot.isReady()) {
   await DevMode();
  }
 
  displayRule();
  terminal.writeLine("\n");
  await pressAnyKey(chalk.dim("Press Enter key to continue..."));

  const gameState: GuessGameState = {
    lives: INITIAL_LIVES,
    maxLives: MAX_LIVES,
    currentStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    difficulty: 'easy',
    technology: selectedTech,
    score: 0
  };

  let playing = true;


  while (playing && gameState.lives > 0) {
    clearScreen();
    renderHeader('guess-output');
    displayGameStatus(gameState);

    // Generate code challenge
    terminal.writeLine('\n🤖 AI is generating a code challenge...\n');
    
    try {
      const challenge = await generateCodeChallenge(copilot, gameState);
      
      clearScreen();
      renderHeader('guess-output');
      displayGameStatus(gameState);

      const textStyles = getLanguageTheme(gameState.technology);

      const textBgColor = chalk.bgHex(textStyles.bg);
      const textColor = chalk.hex(textStyles.text);
      terminal.writeLine("\n")
      terminal.writeLine(textColor(textBgColor.bold(` </> ${gameState.technology} Code `)));
     
      terminal.writeLine("\n")
      terminal.writeLine(chalk.dim(challenge.code + '\n'));
      terminal.writeLine("\n")
      
      terminal.writeLine('What will this code output?\n');
      
      // Get user's guess
      const userGuess = await getUserGuess();
      
      // Evaluate with Copilot
   terminal.writeLine("🤖 AI is evaluating your guess...");
      const evaluation = await evaluateGuess(copilot, challenge, userGuess);
      
      
      gameState.totalAttempts++;
      
      clearScreen();
      renderHeader('guess-output');
      displayGameStatus(gameState);
      
      if (evaluation.isCorrect) {
        gameState.totalCorrect++;
        gameState.currentStreak++;
        gameState.score += getScoreForDifficulty(challenge.difficulty);
        
       await horiCenterFiglet('CORRECT',"#008000");
      
        terminal.writeLine('\n' + evaluation.quirkyFeedback + '\n');
        terminal.writeLine(`💡 ${evaluation.explanation}\n`);
        
        // Check for difficulty increase
        if (gameState.currentStreak >= STREAK_FOR_DIFFICULTY_UP && gameState.difficulty !== 'hard') {
          const newDifficulty = gameState.difficulty === 'easy' ? 'medium' : 'hard';
          terminal.writeLine(`\n🔥 ${STREAK_FOR_DIFFICULTY_UP} in a row! Difficulty increased to ${newDifficulty.toUpperCase()}!\n`);
          gameState.difficulty = newDifficulty;
          gameState.currentStreak = 0;
        }
        
        // Check for life bonus
        if (gameState.totalCorrect % STREAK_FOR_LIFE_BONUS === 0 && gameState.lives < gameState.maxLives) {
          gameState.lives++;
          terminal.writeLine(`\n💖 Bonus Life! You now have ${gameState.lives} lives!\n`);
        }
        
      } else {
        gameState.lives--;
        gameState.currentStreak = 0;
        await horiCenterFiglet('WRONG',"#FF0000")
        terminal.writeLine('\n' + evaluation.quirkyFeedback + '\n');
        terminal.writeLine(`📝 Correct output:\n${challenge.expectedOutput}\n`);
        terminal.writeLine(`💡 ${evaluation.explanation}\n`);
        
        if (gameState.lives > 0) {
          terminal.writeLine(`\n💔 You lost a life! ${gameState.lives} lives remaining.\n`);
        } else {
          terminal.writeLine('\n💀 GAME OVER! All lives lost.\n');
        }
      }
      
      if (gameState.lives > 0) {
               
        await pressAnyKey('\nPress Enter to continue...');
      }
      
    } catch (error) {
      terminal.writeLine(`\n❌ Error generating challenge: ${error}\n`);
      terminal.writeLine('Skipping this round...\n');
      await delay(2000);
    }
  }

  // Game over - show final stats
  await showFinalStats(gameState);
  
  // Small delay to ensure stdin is ready
  await delay(1000);
  
  // Flush any pending stdin input
  if (process.stdin.isTTY && process.stdin.isPaused()) {
    process.stdin.resume();
  }
  if (process.stdin.readable && process.stdin.readableLength > 0) {
    process.stdin.read();
  }
  
  // Add message before menu
  terminal.writeLine('\nWhat would you like to do?\n');
  
  // Show post-game menu
  return await showPostGameMenu();
}

function spaceBetween(contents:string[]):number{
  const contentWidth = terminal.getContentWidth();
  const ruleMaxWidth = Math.floor( contentWidth - (contentWidth / 3))
  return ruleMaxWidth - contents.reduce((accumulator,val)=> accumulator+val.length,0);

}


function displayRule(){
 clearScreen();
  const ruleHeading = "  Rules  ";
  const ruleBorderWidth = (terminal.getContentWidth() - ruleHeading.length) / 2; 
  const lives = "❤️ Lives";
  const totalLives = `total ${MAX_LIVES}`;
  const wrong = "❌ wrong guess";
  const oneMinus = `-1 life`;
  const streakRule = "🔥 3 in a row";
  const levelUP = `Difficulty ↑`;
  const clearDifficult = "⭐ Clear 3 round"
  const plusLife = "+1 life";
  const noLives = "☠️ No lives";
  const gameOver = "Game Over";

  const contentWidth = terminal.getContentWidth();
  const rulesLeftpadding = Math.floor((contentWidth / 3) / 2);
  
  terminal.writeLine('\n🎯 Guess the Output Mode\n');
  terminal.writeLine('AI will generate code snippets for you to analyze!\n');
  terminal.writeLine(`\n${"_".repeat(ruleBorderWidth)}${ruleHeading}${"_".repeat(ruleBorderWidth)}\n`);
   const gap = " ".repeat(spaceBetween([lives,totalLives]))
   const gap1 = " ".repeat(spaceBetween([wrong,oneMinus]))
   const gap2 = " ".repeat(spaceBetween([streakRule,levelUP]))
   const gap3 = " ".repeat(spaceBetween([clearDifficult,plusLife]))
   const gap4 = " ".repeat(spaceBetween([noLives,gameOver]))
  terminal.writeLine(`${" ".repeat(rulesLeftpadding)}${lives}${gap}${totalLives}\n`);
  terminal.writeLine(`${" ".repeat(rulesLeftpadding)}${wrong}${gap1}${oneMinus}\n`);
  terminal.writeLine(`${" ".repeat(rulesLeftpadding)}${streakRule}${gap2}${levelUP}\n`);
  terminal.writeLine(`${" ".repeat(rulesLeftpadding)}${clearDifficult}${gap3}${plusLife}\n`);
  terminal.writeLine(`${" ".repeat(rulesLeftpadding)}${noLives}${gap4}${gameOver}\n`);
}

function displayGameStatus(state: GuessGameState): void {
  const hearts = '❤️ '.repeat(state.lives) + '🖤 '.repeat(Math.max(0, state.maxLives - state.lives));
  const difficulty: string = state.difficulty.toUpperCase();
  const streak :string=`${state.currentStreak.toString()}🔥  `;
  const score : string= `  Score : ${state.score.toString()}`;

 

const heartsWidth: number = hearts.length;
const scoreWidth:number =  score.length;
const difficultyWidth: number = difficulty.length; 
const streakWidth : number = streak.length;

const contentWidth = difficultyWidth + heartsWidth + streakWidth + scoreWidth;

const spaceBetween: number = Math.max(0, terminal.getContentWidth() - contentWidth);

terminal.writeLine(`${difficulty}${score}${" ".repeat(spaceBetween)}${streak}${hearts}`);

}

async function generateCodeChallenge(copilot: CopilotEvaluator, state: GuessGameState, useFallback = false): Promise<CodeChallenge> {
  // If fallback requested or Copilot unavailable, use predefined challenges
  if (useFallback || !copilot.isReady()) {
    return getFallbackChallenge(state);
  }

  const prompt = `Generate a ${state.difficulty} level ${state.technology} code snippet that produces specific output.
  
Requirements:
- The code should be 5-15 lines
- It should have a clear, deterministic output
- Difficulty: ${state.difficulty}
- For ${state.difficulty === 'easy' ? 'easy, use basic syntax and simple operations' : state.difficulty === 'medium' ? 'medium, use intermediate concepts' : 'hard, use advanced features or tricky behavior'}

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "code": "the code snippet",
  "output": "the exact output this code produces",
  "explanation": "brief explanation of why it produces this output"
}`;

  try {
    const response = await copilot.askCopilot(prompt);
    
    // Parse the JSON response with robust extraction
    // Remove markdown code blocks if present
    let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON object - match from first { to last }
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }
    
    // Parse the extracted JSON
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsed.code || !parsed.output) {
      throw new Error('Missing required fields (code or output)');
    }
    
    return {
      code: parsed.code,
      expectedOutput: parsed.output,
      difficulty: state.difficulty,
      technology: state.technology,
      explanation: parsed.explanation || 'No explanation provided'
    };
  } catch (error) {
    // If parsing fails, use fallback
    terminal.writeLine(`⚠️  AI generation failed, using fallback challenge...\n`, false);
    await delay(1000);
    return getFallbackChallenge(state);
  }
}

function getFallbackChallenge(state: GuessGameState): CodeChallenge {
  const challenges = FALLBACK_CHALLENGES[state.technology] || FALLBACK_CHALLENGES['JavaScript'];
  const difficultyMatches = challenges.filter(c => c.difficulty === state.difficulty);
  const pool = difficultyMatches.length > 0 ? difficultyMatches : challenges;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

async function getUserGuess(): Promise<string> {
  return new Promise((resolve) => {
    terminal.writeLine(chalk.dim('Your guess (Enter for new line, Ctrl+S to submit):\n'));
    
    const lines: string[] = [''];
    let cursorRow = 0;
    let cursorCol = 0;
    
    // Show cursor for input
    showCursor();
    
    // Enable raw mode for keypress detection
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    
    const render = () => {
      // Save cursor position
      process.stdout.write('\x1B[s');
      
      // Move to start of input area
      process.stdout.write('\x1B[2K'); // Clear line
      
      // Render current line
      const currentLine = lines[cursorRow] || '';
      process.stdout.write('\r' + currentLine);
      
      // Restore cursor to correct position
      process.stdout.write('\r');
      if (cursorCol > 0) {
        process.stdout.write(`\x1B[${cursorCol}C`);
      }
    };
    
    const onKeypress = (str: string, key: any) => {
      if (key.ctrl && key.name === 's') {
        // Ctrl+S to submit
        cleanup();
        hideCursor(); // Hide cursor after submission
        process.stdout.write('\n\n');
        resolve(lines.join('\n').trim());
        return;
      }
      
      if (key.name === 'return' || key.name === 'enter') {
        // Enter for new line
        const currentLine = lines[cursorRow] || '';
        const beforeCursor = currentLine.slice(0, cursorCol);
        const afterCursor = currentLine.slice(cursorCol);
        
        lines[cursorRow] = beforeCursor;
        lines.splice(cursorRow + 1, 0, afterCursor);
        
        cursorRow++;
        cursorCol = 0;
        process.stdout.write('\n');
      } else if (key.name === 'backspace') {
        // Handle backspace
        const currentLine = lines[cursorRow] || '';
        
        if (cursorCol > 0) {
          // Delete character before cursor
          lines[cursorRow] = currentLine.slice(0, cursorCol - 1) + currentLine.slice(cursorCol);
          cursorCol--;
          render();
        } else if (cursorRow > 0) {
          // Merge with previous line
          const prevLine = lines[cursorRow - 1] || '';
          cursorCol = prevLine.length;
          lines[cursorRow - 1] = prevLine + currentLine;
          lines.splice(cursorRow, 1);
          cursorRow--;
          process.stdout.write('\x1B[A'); // Move up
          render();
        }
      } else if (key.name === 'delete') {
        // Handle delete key
        const currentLine = lines[cursorRow] || '';
        
        if (cursorCol < currentLine.length) {
          lines[cursorRow] = currentLine.slice(0, cursorCol) + currentLine.slice(cursorCol + 1);
          render();
        } else if (cursorRow < lines.length - 1) {
          // Merge with next line
          lines[cursorRow] = currentLine + (lines[cursorRow + 1] || '');
          lines.splice(cursorRow + 1, 1);
          render();
        }
      } else if (key.name === 'left') {
        // Move cursor left
        if (cursorCol > 0) {
          cursorCol--;
          process.stdout.write('\x1B[D');
        } else if (cursorRow > 0) {
          cursorRow--;
          cursorCol = (lines[cursorRow] || '').length;
          process.stdout.write('\x1B[A'); // Move up
          render();
        }
      } else if (key.name === 'right') {
        // Move cursor right
        const currentLine = lines[cursorRow] || '';
        
        if (cursorCol < currentLine.length) {
          cursorCol++;
          process.stdout.write('\x1B[C');
        } else if (cursorRow < lines.length - 1) {
          cursorRow++;
          cursorCol = 0;
          process.stdout.write('\n\r');
        }
      } else if (key.name === 'up') {
        // Move cursor up
        if (cursorRow > 0) {
          cursorRow--;
          const prevLine = lines[cursorRow] || '';
          cursorCol = Math.min(cursorCol, prevLine.length);
          process.stdout.write('\x1B[A');
          render();
        }
      } else if (key.name === 'down') {
        // Move cursor down
        if (cursorRow < lines.length - 1) {
          cursorRow++;
          const nextLine = lines[cursorRow] || '';
          cursorCol = Math.min(cursorCol, nextLine.length);
          process.stdout.write('\x1B[B');
          render();
        }
      } else if (key.name === 'home') {
        // Move to start of line
        cursorCol = 0;
        render();
      } else if (key.name === 'end') {
        // Move to end of line
        const currentLine = lines[cursorRow] || '';
        cursorCol = currentLine.length;
        render();
      } else if (key.ctrl && key.name === 'c') {
        // Ctrl+C to exit
        cleanup();
        process.exit(0);
      } else if (str && !key.ctrl && !key.meta) {
        // Regular character input - insert at cursor position
        const currentLine = lines[cursorRow] || '';
        lines[cursorRow] = currentLine.slice(0, cursorCol) + str + currentLine.slice(cursorCol);
        cursorCol++;
        render();
      }
    };
    
    const cleanup = () => {
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.removeListener('keypress', onKeypress);
      process.stdin.pause();
    };
    
    process.stdin.on('keypress', onKeypress);
    process.stdin.resume();
  });
}

async function evaluateGuess(copilot: CopilotEvaluator, challenge: CodeChallenge, userGuess: string): Promise<{
  isCorrect: boolean;
  explanation: string;
  quirkyFeedback: string;
}> {
  const prompt = `Evaluate if the user's guess matches the expected output.

Code:
${challenge.code}

Expected Output:
${challenge.expectedOutput}

User's Guess:
${userGuess}

Determine if the guess is correct (accounting for minor formatting differences, whitespace, etc.).
Also provide a quirky, fun, short feedback message (5-10 words) and a brief explanation.

Respond in JSON format:
{
  "isCorrect": true or false,
  "explanation": "brief explanation",
  "quirkyFeedback": "fun short message"
}`;

  const response = await copilot.askCopilot(prompt);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      isCorrect: parsed.isCorrect === true,
      explanation: parsed.explanation || challenge.explanation || 'No explanation available',
      quirkyFeedback: parsed.quirkyFeedback || (parsed.isCorrect ? 'Nice one!' : 'Not quite!')
    };
  } catch (error) {
    // Fallback to simple string comparison
    const isCorrect = userGuess.trim() === challenge.expectedOutput.trim();
    return {
      isCorrect,
      explanation: challenge.explanation || 'Compare your output with the expected output.',
      quirkyFeedback: isCorrect ? 'Spot on!' : 'Give it another shot!'
    };
  }
}

function getScoreForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 25;
    case 'hard': return 50;
  }
}

async function showFinalStats(state: GuessGameState): Promise<void> {
  clearScreen();
  renderHeader('guess-output');
  
  terminal.writeLine('\n' + '═'.repeat(60));
  terminal.writeLine('🏁 GAME OVER!');
  terminal.writeLine('═'.repeat(60));
  terminal.writeLine(`\n📊 Final Statistics:`);
  terminal.writeLine(`   Technology: ${state.technology}`);
  terminal.writeLine(`   Final Score: ${state.score}`);
  terminal.writeLine(`   Correct Guesses: ${state.totalCorrect}/${state.totalAttempts}`);
  terminal.writeLine(`   Accuracy: ${state.totalAttempts > 0 ? ((state.totalCorrect / state.totalAttempts) * 100).toFixed(1) : 0}%`);
  terminal.writeLine(`   Highest Difficulty: ${state.difficulty.toUpperCase()}`);
  terminal.writeLine('\n' + '═'.repeat(60) + '\n');
}

async function pressAnyKey(message: string): Promise<void> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    terminal.write(message, false);
    showCursor(); // Show cursor when waiting for key
    
    rl.question('', () => {
      rl.close();
      hideCursor(); // Hide cursor after keypress
      // Small delay to ensure cleanup
      setTimeout(() => resolve(), 100);
    });
  });
}
