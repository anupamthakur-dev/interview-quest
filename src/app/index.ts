import { setupScreen, clearScreen, showCursor } from '../ui/screen';
import { renderBanner } from '../ui/banner';
import { renderHeader } from '../ui/header';
import { showMainMenu, askContinue, selectTechnology } from '../ui/menu-native';
import { getUserAnswer, pressAnyKey, askForHint, selectDifficulty } from '../ui/input';
import { terminal } from '../ui/terminal';
import { GameEngine } from '../game/engine';
import { RoundManager } from '../game/round';
import { ScoringSystem } from '../game/scoring';
import { QuestionLoader } from '../questions/loader';
import { BasicEvaluator } from '../evaluation/evaluator';
import { CopilotEvaluator } from '../evaluation/copilot';
import { FeedbackGenerator } from '../evaluation/feedback';
import { getRubricForMode } from '../evaluation/rubric';
import { Timer } from '../ui/timer';
import { GameMode } from '../types/game';
import { checkRequirements } from './environment';
import { delay, sleep } from '../utils/delay';
import { AVAILABLE_TOPICS } from '../utils/topics';
import { playGuessTheOutput } from '../game/guess-output';
import { PostGameChoice, showPostGameMenu } from '../ui/post-game-menu';
import { DevMode } from '../ui/devMode';
import { interviewStatsBar } from '../ui/interviewStatsBar';

export async function startApp(): Promise<void> {
  
  // Check terminal size first
  await terminal.waitForValidSize();

  // Check system requirements
  const requirements = checkRequirements();
  if (!requirements.passed) {
    terminal.writeLine('❌ System requirements not met:');
    requirements.errors.forEach(err => terminal.writeLine(`   ${err}`));
    process.exit(1);
  }

  let running = true;

  while (running) {
    await setupScreen('main-menu');
    await renderBanner();

    await sleep(4);

    const selectedMode = await showMainMenu();

    if (selectedMode === 'exit') {
      clearScreen();
      terminal.writeLine('\n👋 Thanks for playing InterviewQuest! Good luck with your interviews!\n');
      showCursor(); // Show cursor before exit
      break; // Exit the loop
    }

    const postGameChoice = await handleGameMode(selectedMode as GameMode);
    
    // Handle post-game choice
    if (postGameChoice === 'exit') {
      clearScreen();
      terminal.writeLine('\n👋 Thanks for playing InterviewQuest! Good luck with your interviews!\n');
      showCursor(); // Show cursor before exit
      break; // Exit the loop
    }
    // 'continue' and 'home' both loop back automatically
  }
}

async function handleGameMode(mode: GameMode): Promise<PostGameChoice> {
  if (mode === 'practice-grounds') {
    clearScreen();
    terminal.writeLine(`\n${getModeEmoji(mode)} ${getModeTitle(mode)} - Coming Soon!\n`);
    terminal.writeLine(getModeDescription(mode));
    await delay(2000);
    return 'home';
  }

  // Ask for technology selection for all modes
  const selectedTech = await selectTechnology();

  let choice: PostGameChoice = 'home';

  // Loop to handle "continue" choice
  while (true) {
    if (mode === 'guess-output') {
      choice = await playGuessTheOutput(selectedTech);
    } else if (mode === 'interview-mode') {
      choice = await playInterviewMode(selectedTech);
    }
    
    // If user chose "continue", play again with same mode/tech
    if (choice === 'continue') {
      continue;
    } else {
      // Exit loop for 'home' or 'exit'
      break;
    }
  }

  return choice;
}

async function playInterviewMode(selectedTech: string): Promise<PostGameChoice> {
  const copilotEvaluator = new CopilotEvaluator();
  
  const isDevMode = !copilotEvaluator.isReady();
  
  if (isDevMode) {
  await  DevMode();
  }

  // Select difficulty
  const selectedDifficulty = await selectDifficulty();
  
  clearScreen();
   renderHeader('interview-mode');
  // terminal.writeLine(`\n💼 Interview Mode: ${selectedTech} - ${selectedDifficulty}\n`);
  
  terminal.writeLine('\n'.repeat(Math.floor((terminal.getHeight() - 2) / 2)))
  if (isDevMode) {
    terminal.writeLine('📚 Using question bank (Dev Mode)\n');
  } else {
    terminal.writeLine('🤖 AI will generate questions and evaluate your answers.\n');
  }
  terminal.writeLine('⚠️  Question generation and evaluation may take a few moments.\n');
  await delay(2500);

  const engine = new GameEngine('interview-mode');
  const roundManager = new RoundManager();
  const scoringSystem = new ScoringSystem();
  const feedbackGen = new FeedbackGenerator();
  const rubric = getRubricForMode('interview-mode');

  let hintsUsed = 0;
  const questionCache: Map<number, any> = new Map();

  while (!engine.isGameOver()) {
    clearScreen();
    renderHeader('interview-mode');
    
    engine.startRound();
    const currentRound = engine.getCurrentRound();
    
    terminal.writeLine(feedbackGen.generateProgressMessage(currentRound, engine.getTotalRounds()));
    terminal.writeLine(`\n📚 Topic: ${selectedTech}`);
    terminal.writeLine(`⚡ Difficulty: ${selectedDifficulty}\n`);
    
    // Generate question with AI or use cached
    let question;
    if (questionCache.has(currentRound)) {
      question = questionCache.get(currentRound);
    } else {
      // In dev mode, skip AI generation
      if (isDevMode) {
        terminal.writeLine('📚 Loading question from question bank...\n');
        const questionLoader = new QuestionLoader();
        question = questionLoader.getRandomQuestion(undefined, selectedDifficulty);
        
        if (!question) {
          terminal.writeLine('❌ No questions available!');
          break;
        }
        questionCache.set(currentRound, question);
        await delay(1000);
      } else {
        terminal.writeLine('🤖 AI is generating your question...\n');
        try {
          question = await copilotEvaluator.generateQuestion(selectedTech, selectedDifficulty, currentRound);
          questionCache.set(currentRound, question);
          terminal.writeLine('✅ Question generated!\n');
          await delay(1000);
        } catch (error) {
          terminal.writeLine(`❌ Failed to generate question: ${error}\n`);
          terminal.writeLine('Using pre-defined question instead...\n');
          const questionLoader = new QuestionLoader();
          question = questionLoader.getRandomQuestion(undefined, selectedDifficulty);
          
          if (!question) {
            terminal.writeLine('❌ No questions available!');
            break;
          }
          await delay(2000);
        }
      }
    }
    
    clearScreen();
    renderHeader('interview-mode');
    const state = {
      level : selectedDifficulty,
      tech : selectedTech,
      progess : {
        current : currentRound,
        total : engine.getTotalRounds()
      }
    }
    interviewStatsBar(state);
 
    
    // Offer hint
    let hintGiven = false;
    if (question.hints && question.hints.length > 0) {
      const wantsHint = await askForHint();
      if (wantsHint) {
        hintsUsed++;
        terminal.writeLine('\n💡 Generating hint with AI...\n');
        try {
          const hint = await copilotEvaluator.generateHint(question, hintsUsed);
          terminal.writeLine(`💡 ${hint}\n`);
          hintGiven = true;
        } catch (error) {
          terminal.writeLine('❌ Failed to generate hint. Here\'s a standard one:');
          terminal.writeLine(`💡 ${question.hints[0]}\n`);
          hintGiven = true;
        }
        await delay(2000);
      }
    }
    
    const timer = new Timer();
    timer.start();
    
    const userAnswer = await getUserAnswer(question.text, question.timeLimit);
    const timeElapsed = timer.stop();
    
    // Evaluation with Copilot or basic evaluator
    clearScreen();
    renderHeader('interview-mode');
    
    let evaluation;
    
    if (isDevMode) {
      // Use basic evaluation in dev mode
      terminal.writeLine('\n📝 Evaluating your answer...\n');
      await delay(1000);
      
      const basicEvaluator = new BasicEvaluator();
      evaluation = basicEvaluator.evaluate(question, userAnswer, rubric);
      const timeBonus = roundManager.calculateTimeBonus(timeElapsed, question.timeLimit);
      const finalScore = scoringSystem.calculateScore(evaluation, timeBonus);
      const xpEarned = scoringSystem.calculateXP(finalScore, question.difficulty);
      
      evaluation.score = finalScore;
      evaluation.xpEarned = xpEarned;
    } else {
      // Use AI evaluation in production
      terminal.writeLine('\n🤖 AI is evaluating your answer...\n');
      terminal.writeLine('This may take a few moments.\n');
      
      try {
        evaluation = await copilotEvaluator.evaluate(question, userAnswer);
        
        // Apply hint penalty if hint was used
        if (hintGiven) {
          evaluation.score = Math.max(0, evaluation.score - 10);
        }
        
        const timeBonus = roundManager.calculateTimeBonus(timeElapsed, question.timeLimit);
        const finalScore = scoringSystem.calculateScore(evaluation, timeBonus);
        const xpEarned = scoringSystem.calculateXP(finalScore, question.difficulty);
        
        evaluation.score = finalScore;
        evaluation.xpEarned = xpEarned;
      } catch (error) {
        terminal.writeLine(`\n⚠️  AI evaluation failed: ${error}\n`);
        terminal.writeLine('Falling back to basic evaluation...\n');
        await delay(1500);
        
        const basicEvaluator = new BasicEvaluator();
        evaluation = basicEvaluator.evaluate(question, userAnswer, rubric);
        const timeBonus = roundManager.calculateTimeBonus(timeElapsed, question.timeLimit);
        const finalScore = scoringSystem.calculateScore(evaluation, timeBonus);
        const xpEarned = scoringSystem.calculateXP(finalScore, question.difficulty);
        
        evaluation.score = finalScore;
        evaluation.xpEarned = xpEarned;
      }
    }
    
    // Complete round
    const roundData = roundManager.createRound(currentRound, question);
    const completedRound = roundManager.completeRound(
      roundData,
      userAnswer,
      timeElapsed,
      evaluation.score,
      evaluation.xpEarned,
      evaluation.correctConcepts,
      evaluation.feedback
    );
    
    engine.completeRound(completedRound);
    
    // Show feedback
    clearScreen();
    renderHeader('interview-mode');
    terminal.writeLine(feedbackGen.generateDetailedFeedback(evaluation));
    
    if (!engine.isGameOver()) {
      await pressAnyKey('\nPress Enter to continue to next question...');
    }
  }

  // Show final results
  await showGameSummary(engine, scoringSystem);
  
  terminal.writeLine(`\n📚 Topic: ${selectedTech}`);
  terminal.writeLine(`⚡ Difficulty: ${selectedDifficulty}`);
  if (hintsUsed > 0) {
    terminal.writeLine(`💡 Hints used: ${hintsUsed}`);
  }
  
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
  terminal.writeLine('\n\nWhat would you like to do?\n');
  
  // Show post-game menu
  return await showPostGameMenu();
}

async function showGameSummary(engine: GameEngine, scoringSystem: ScoringSystem): Promise<void> {
  clearScreen();
  renderHeader('interview-mode');
  
  const state = engine.getState();
  const level = scoringSystem.calculateLevelFromXP(state.xp);
  const grade = scoringSystem.assignGrade(state.score / state.totalRounds);
  
  terminal.writeLine('\n' + '═'.repeat(60));
  terminal.writeLine('🏁 GAME COMPLETE!');
  terminal.writeLine('═'.repeat(60));
  terminal.writeLine(`\n📊 Final Score: ${state.score}/${state.totalRounds * 100}`);
  terminal.writeLine(`🎯 Accuracy: ${state.accuracy.toFixed(1)}%`);
  terminal.writeLine(`⭐ Total XP: ${state.xp}`);
  terminal.writeLine(`🏆 Level: ${level}`);
  terminal.writeLine(`📝 Grade: ${grade}`);
  terminal.writeLine('\n' + '═'.repeat(60));
}

function getModeEmoji(mode: GameMode): string {
  const emojis = {
    'guess-output': '🎯',
    'interview-mode': '💼',
    'practice-grounds': '🎮'
  };
  return emojis[mode];
}

function getModeTitle(mode: GameMode): string {
  const titles = {
    'guess-output': 'Guess the Output',
    'interview-mode': 'Interview Mode',
    'practice-grounds': 'Practice Grounds'
  };
  return titles[mode];
}

function getModeDescription(mode: GameMode): string {
  const descriptions = {
    'guess-output': 'AI generates code, you guess the output with lives system',
    'interview-mode': 'Realistic interview simulation with AI evaluation\n(Requires GitHub Copilot CLI)',
    'practice-grounds': 'Practice mode with detailed feedback and no time pressure'
  };
  return descriptions[mode];
}
