import chalk from "chalk";
import { delay } from "../utils/delay";
import { clearScreen } from "./screen";
import { terminal } from "./terminal";
import { config } from "../config/environment";


export async function DevMode(){
    clearScreen();
    
    // Check if AI was requested but not available
    const aiRequested = config.USE_COPILOT;
    
    const verticalPad = Math.floor((terminal.getHeight() - 3)/2);
    terminal.writeLine("\n".repeat(verticalPad));
    
    if (aiRequested) {
        // User wanted AI but it's not available
        const errorText = 'GitHub Copilot CLI is not available or not configured.\n';
        const leftPadding = Math.floor((terminal.getContentWidth() - errorText.length) / 2);
        terminal.writeLine(" ".repeat(leftPadding)+ chalk.red('⚠️  AI Mode Unavailable\n'));
        terminal.writeLine(" ".repeat(leftPadding)+chalk.yellow(errorText));
        terminal.writeLine(" ".repeat(leftPadding)+chalk.dim('Requirements:\n'));
        terminal.writeLine(" ".repeat(leftPadding)+chalk.dim('  • Install GitHub CLI: gh --version\n'));
        terminal.writeLine(" ".repeat(leftPadding)+chalk.dim('  • Install Copilot: gh extension install github/gh-copilot\n'));
        terminal.writeLine(" ".repeat(leftPadding)+chalk.dim('  • Authenticate: gh auth login\n'));
        terminal.writeLine("\n");
        terminal.writeLine(" ".repeat(leftPadding)+chalk.cyan('→ Falling back to question bank mode...\n'));
    } else {
        // Running in default mode without AI
        const longText ='Using pre-defined questions and basic evaluation.\n';
        const leftPadding = Math.floor((terminal.getContentWidth() - longText.length) / 2);
        terminal.writeLine(" ".repeat(leftPadding)+'⚙️  Development Mode - Using Question Bank\n');
        terminal.writeLine(" ".repeat(leftPadding)+chalk.dim(longText));
        terminal.writeLine(" ".repeat(leftPadding)+chalk.dim('(Use --ai flag to enable GitHub Copilot features)\n'));
    }
    
    await delay(3000);
}