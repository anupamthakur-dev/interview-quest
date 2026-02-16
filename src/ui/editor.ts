import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

/**
 * Opens user's preferred editor to get multi-line input
 * @param prompt - Question or prompt to show
 * @returns User's answer from the editor
 */
export async function openEditor(prompt: string = ''): Promise<string> {
  // Create temp file
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `interviewquest-${Date.now()}.txt`);
  
  try {
    // Write prompt to temp file as a comment
    const initialContent = prompt 
      ? `# ${prompt}\n# Write your answer below this line:\n\n`
      : '# Write your answer below:\n\n';
    
    fs.writeFileSync(tempFile, initialContent, 'utf-8');
    
    // Determine editor
    const editor = getEditor();
    
    // Open editor and wait for it to close
    execSync(`${editor} "${tempFile}"`, {
      stdio: 'inherit'
    });
    
    // Read the content
    const content = fs.readFileSync(tempFile, 'utf-8');
    
    // Remove comment lines and get answer
    const lines = content.split('\n');
    const answerLines = lines.filter(line => !line.trim().startsWith('#'));
    const answer = answerLines.join('\n').trim();
    
    // Clean up
    fs.unlinkSync(tempFile);
    
    return answer;
    
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    throw error;
  }
}

/**
 * Get the user's preferred editor
 */
function getEditor(): string {
  // Check environment variables
  const editor = process.env.VISUAL || 
                process.env.EDITOR || 
                getDefaultEditor();
  
  return editor;
}

/**
 * Get default editor based on platform
 */
function getDefaultEditor(): string {
  const platform = os.platform();
  
  if (platform === 'win32') {
    // Try common Windows editors
    try {
      execSync('where notepad.exe', { stdio: 'ignore' });
      return 'notepad';
    } catch {
      return 'notepad'; // Fallback, should always exist
    }
  } else if (platform === 'darwin') {
    // macOS
    return 'nano'; // Usually available, or could use 'vim'
  } else {
    // Linux/Unix
    return 'nano'; // Most accessible for beginners
  }
}

/**
 * Check if editor is available
 */
export function isEditorAvailable(): boolean {
  try {
    const editor = getEditor();
    
    if (os.platform() === 'win32') {
      execSync(`where ${editor}`, { stdio: 'ignore' });
    } else {
      execSync(`which ${editor}`, { stdio: 'ignore' });
    }
    
    return true;
  } catch {
    return false;
  }
}
