import { showSelectMenu, SelectOption } from './select';
import { terminal } from './terminal';

export async function showMainMenu(): Promise<string> {
  const options: SelectOption[] = [
    { 
      name: '🎯 Guess the Output', 
      value: 'guess-output',
      description: 'AI generates code, you guess output'
    },
    { 
      name: '💼 Interview Mode', 
      value: 'interview-mode',
      description: 'AI-powered realistic interview'
    },
    { 
      name: '🎮 Practice Grounds', 
      value: 'practice-grounds',
      description: 'Practice with no pressure'
    },
    { 
      name: '❌ Exit', 
      value: 'exit',
      description: 'Quit the application'
    }
  ];

  return showSelectMenu({
    message: 'Select a mode:',
    options
  });
}

export async function askContinue(): Promise<boolean> {
  const options: SelectOption[] = [
    { name: '✅ Yes, continue playing', value: 'yes' },
    { name: '❌ No, exit', value: 'no' }
  ];

  const result = await showSelectMenu({
    message: 'Continue playing?',
    options
  });

  return result === 'yes';
}

export async function selectTechnology(): Promise<string> {
  const options: SelectOption[] = [
    { name: '📜 JavaScript', value: 'JavaScript' },
    { name: '📘 TypeScript', value: 'TypeScript' },
    { name: '⚛️  React', value: 'React' },
    { name: '🟢 Node.js', value: 'Node.js' },
    { name: '🔷 Angular', value: 'Angular' },
    { name: '💚 Vue.js', value: 'Vue.js' },
    { name: '🎨 CSS', value: 'CSS' },
    { name: '🌐 HTML', value: 'HTML' },
    { name: '🐍 Python', value: 'Python' },
    { name: '☕ Java', value: 'Java' },
    { name: '⚙️  System Design', value: 'System Design' },
    { name: '🔢 Data Structures & Algorithms', value: 'DSA' }
  ];

  return showSelectMenu({
    message: 'Select your technology/topic:',
    options
  });
}
