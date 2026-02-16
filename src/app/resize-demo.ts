import { terminal } from '../ui/terminal';
import { clearScreen } from '../ui/screen';

/**
 * Demo showing dynamic terminal resize with state preservation
 */
export async function runResizeDemo(): Promise<void> {
  clearScreen();
  
  terminal.writeLine('╔════════════════════════════════════════════════════════╗');
  terminal.writeLine('║          TERMINAL RESIZE DEMO                          ║');
  terminal.writeLine('╚════════════════════════════════════════════════════════╝');
  terminal.writeLine('');
  terminal.writeLine('This demo shows how the terminal adjusts to resize events.');
  terminal.writeLine('');
  terminal.writeLine('📐 Current terminal dimensions:');
  terminal.writeLine(`   Width: ${terminal.getWidth()} columns`);
  terminal.writeLine(`   Height: ${terminal.getHeight()} rows`);
  terminal.writeLine(`   Content Width: ${terminal.getContentWidth()} columns`);
  terminal.writeLine('');
  terminal.writeLine('✨ Features:');
  terminal.writeLine('   • Content is always centered horizontally');
  terminal.writeLine('   • Automatically adjusts when you resize the terminal');
  terminal.writeLine('   • Shows warning when terminal is too small (< 60x20)');
  terminal.writeLine('   • Preserves content state during resize');
  terminal.writeLine('');
  terminal.writeLine('🔧 Try it:');
  terminal.writeLine('   1. Resize your terminal window');
  terminal.writeLine('   2. Watch content re-center automatically');
  terminal.writeLine('   3. Make it smaller than 60x20 to see the warning');
  terminal.writeLine('   4. Expand it again to restore content');
  terminal.writeLine('');
  terminal.writeLine('Press Ctrl+C to exit the demo.');
  terminal.writeLine('');
  
  // Keep the demo running and show real-time dimensions
  setInterval(() => {
    // This will be called on resize to update dimensions display
  }, 1000);
  
  // Wait indefinitely
  await new Promise(() => {});
}
