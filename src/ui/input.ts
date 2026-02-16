import * as readline from 'readline';
import { terminal } from './terminal';
import { openEditor } from './editor';
import { showCursor, hideCursor } from './screen';

export async function getUserInput(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    terminal.write(question + ' ', false); // Don't persist the prompt
    
    rl.question('', (answer) => {
      rl.close();
      // Small delay to ensure cleanup
      setTimeout(() => resolve(answer.trim()), 100);
    });
  });
}

export async function getUserAnswer(questionText: string, timeLimit: number): Promise<string> {
  terminal.writeLine(`\n⏱️  Time limit: ${timeLimit} seconds\n`);
  terminal.writeLine(`Q: ${questionText}\n`);
  terminal.writeLine('Press Enter to open your editor and write your answer...\n', false);
  
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    showCursor(); // Show cursor when waiting for enter
    rl.question('', async () => {
      rl.close();
      hideCursor(); // Hide cursor after enter
      
      try {
        // Open editor and get answer
        const answer = await openEditor(questionText);
        
        // Clear screen and show confirmation
        terminal.clear();
        terminal.writeLine('\n✅ Answer captured!\n');
        
        resolve(answer);
      } catch (error) {
        terminal.writeLine(`\n❌ Error opening editor: ${error}\n`);
        terminal.writeLine('Falling back to inline input...\n');
        
        // Fallback to inline input
        const fallbackAnswer = await getFallbackAnswer();
        resolve(fallbackAnswer);
      }
    });
  });
}

async function getFallbackAnswer(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: ''
    });

    terminal.writeLine('Your answer (press Ctrl+D or Ctrl+Z when done):\n', false);
    showCursor(); // Show cursor for input
    
    const lines: string[] = [];
    
    rl.on('line', (line) => {
      lines.push(line);
    });
    
    rl.on('close', () => {
      hideCursor(); // Hide cursor when done
      resolve(lines.join('\n').trim());
    });

    rl.prompt();
  });
}

export async function pressAnyKey(message: string = '\nPress Enter to continue...'): Promise<void> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    terminal.write(message, false); // Don't persist the prompt
    showCursor(); // Show cursor when waiting for key
    
    rl.question('', () => {
      rl.close();
      hideCursor(); // Hide cursor after keypress
      // Small delay to ensure cleanup
      setTimeout(() => resolve(), 100);
    });
  });
}

export async function askYesNo(question: string, defaultValue: boolean = false): Promise<boolean> {
  const suffix = defaultValue ? ' (Y/n): ' : ' (y/N): ';
  
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    terminal.write(question + suffix, false); // Don't persist the prompt
    showCursor(); // Show cursor for input
    
    rl.question('', (answer) => {
      rl.close();
      hideCursor(); // Hide cursor after input
      
      const input = answer.trim().toLowerCase();
      if (input === '') {
        resolve(defaultValue);
      } else if (input === 'y' || input === 'yes') {
        resolve(true);
      } else if (input === 'n' || input === 'no') {
        resolve(false);
      } else {
        resolve(defaultValue);
      }
    });
  });
}

export async function askForHint(): Promise<boolean> {
  return askYesNo('Would you like a hint? (This may affect your score)', false);
}

export async function selectFromList(
  message: string,
  choices: Array<{ name: string; value: string }>
): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    terminal.writeLine(`\n${message}\n`);
    
    choices.forEach((choice, index) => {
      terminal.writeLine(`  ${index + 1}. ${choice.name}`);
    });
    
    terminal.writeLine('');

    const askSelection = () => {
      terminal.write('Enter your choice (1-' + choices.length + '): ', false);
      showCursor(); // Show cursor for input
      
      rl.question('', (answer) => {
        const selection = parseInt(answer.trim(), 10);
        
        if (isNaN(selection) || selection < 1 || selection > choices.length) {
          terminal.writeLine('\n❌ Invalid choice. Please try again.\n');
          askSelection();
        } else {
          rl.close();
          hideCursor(); // Hide cursor when done
          resolve(choices[selection - 1].value);
        }
      });
    };

    askSelection();
  });
}

export async function selectTopic(topics: readonly string[]): Promise<string> {
  const choices = topics.map(topic => ({ name: topic, value: topic }));
  return selectFromList('Select the technology/topic for your interview:', choices);
}

export async function selectDifficulty(): Promise<'easy' | 'medium' | 'hard'> {
  const { showSelectMenu } = require('./select');
  
  const options = [
    { name: '🟢 Easy', value: 'easy', description: 'Basic concepts and definitions' },
    { name: '🟡 Medium', value: 'medium', description: 'Practical applications' },
    { name: '🔴 Hard', value: 'hard', description: 'Advanced concepts & system design' }
  ];
  
  return showSelectMenu({
    message: 'Select difficulty level:',
    options
  }) as Promise<'easy' | 'medium' | 'hard'>;
}
