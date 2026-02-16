#!/usr/bin/env node

import { terminal } from './ui/terminal';

async function testResize() {
  await terminal.waitForValidSize();
  
  console.clear();
  
  terminal.writeLine('╔════════════════════════════════════════════════════════╗');
  terminal.writeLine('║     DYNAMIC TERMINAL RESIZE TEST                       ║');
  terminal.writeLine('╚════════════════════════════════════════════════════════╝');
  terminal.writeLine('');
  terminal.writeLine('✅ Terminal size is valid!');
  terminal.writeLine('');
  terminal.writeLine(`📐 Dimensions: ${terminal.getWidth()}x${terminal.getHeight()}`);
  terminal.writeLine(`📏 Content Width: ${terminal.getContentWidth()}`);
  terminal.writeLine('');
  terminal.writeLine('🔧 INSTRUCTIONS:');
  terminal.writeLine('');
  terminal.writeLine('1. Resize your terminal window now');
  terminal.writeLine('2. Content will automatically re-center');
  terminal.writeLine('3. Shrink below 60x20 to see the warning');
  terminal.writeLine('4. Expand again to restore this content');
  terminal.writeLine('');
  terminal.writeLine('This is line 1 of persistent content');
  terminal.writeLine('This is line 2 of persistent content');
  terminal.writeLine('This is line 3 of persistent content');
  terminal.writeLine('This is line 4 of persistent content');
  terminal.writeLine('This is line 5 of persistent content');
  terminal.writeLine('');
  terminal.writeLine('All lines above will stay centered when you resize!');
  terminal.writeLine('');
  terminal.writeLine('Press Ctrl+C to exit');
  
  // Show real-time dimension updates
  let counter = 0;
  setInterval(() => {
    counter++;
    const status = `\n⏱️  Running for ${counter} seconds | Terminal: ${terminal.getWidth()}x${terminal.getHeight()}`;
    process.stdout.write('\r' + ' '.repeat(terminal.getWidth()) + '\r');
    terminal.writeRaw(' '.repeat(Math.floor((terminal.getWidth() - status.length) / 2)) + status);
  }, 1000);
  
  // Keep process alive
  await new Promise(() => {});
}

testResize().catch(console.error);
