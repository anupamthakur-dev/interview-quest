#!/usr/bin/env node

import { startApp } from '../src/app/index';

// Parse command-line arguments
const args = process.argv.slice(2);

// Check if we're in production (when installed via npm)
const isProduction = process.env.NODE_ENV === 'production' || !process.cwd().includes('interview-quest');

// Check for help flag (do this before setting AI mode)
if (args.includes('--help') || args.includes('-h')) {
  const mode = isProduction ? 'production' : 'development';
  const defaultBehavior = isProduction 
    ? 'AI features are ENABLED by default (use --no-ai to disable)'
    : 'AI features are DISABLED by default (use --ai to enable)';
  
  console.log(`
╔═══════════════════════════════════════════════════════╗
║              InterviewQuest - CLI Game                ║
╚═══════════════════════════════════════════════════════╝

Usage:
  interviewquest [options]

Options:
  --ai, --copilot, -c    Enable AI features (GitHub Copilot)
  --no-ai                Disable AI features
  --help, -h             Show this help message
  --version, -v          Show version number

Current mode: ${mode}
${defaultBehavior}

Examples:
  interviewquest              # Run with default settings
  interviewquest --ai         # Force enable AI
  interviewquest --no-ai      # Force disable AI
  interviewquest --copilot    # Same as --ai
  interviewquest -c           # Short form for --ai

Default Behavior:
  • Development: AI disabled (use --ai to enable)
  • Production:  AI enabled (use --no-ai to disable)

Requirements for AI mode:
  • GitHub CLI installed (gh --version)
  • Copilot extension (gh extension install github/gh-copilot)
  • Authenticated (gh auth login)
  • GitHub Copilot subscription

GitHub: https://github.com/anupamthakur-dev/interview-quest
`);
  process.exit(0);
}

// Check for version flag
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../../package.json');
  console.log(`InterviewQuest v${pkg.version}`);
  process.exit(0);
}

// Check for AI/Copilot flags
const hasAiFlag = args.includes('--ai') || args.includes('--copilot') || args.includes('-c');
const hasNoAiFlag = args.includes('--no-ai');

// Determine if AI should be enabled
let enableAI = false;

if (hasNoAiFlag) {
  // Explicitly disabled
  enableAI = false;
} else if (hasAiFlag) {
  // Explicitly enabled
  enableAI = true;
} else if (isProduction) {
  // Production default: AI enabled
  enableAI = true;
} else {
  // Development default: AI disabled
  enableAI = false;
}

// Set the environment variable
if (enableAI) {
  process.env.USE_COPILOT = 'true';
  console.log('🤖 AI mode enabled - Using GitHub Copilot\n');
} else {
  process.env.USE_COPILOT = 'false';
  if (!isProduction) {
    console.log('📚 Running in default mode - Use --ai flag to enable Copilot\n');
  }
}

startApp();
