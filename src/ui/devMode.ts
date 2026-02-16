import chalk from "chalk";
import { delay } from "../utils/delay";
import { clearScreen } from "./screen";
import { terminal } from "./terminal";


export async function DevMode(){
    clearScreen();
    const longText ='Copilot is disabled. Using pre-defined questions and basic evaluation.\n';
    const leftPadding = Math.floor((terminal.getContentWidth() - longText.length) / 2) ;
    const verticalPad = Math.floor((terminal.getHeight() - 3)/2);
    terminal.writeLine("\n".repeat(verticalPad));
    terminal.writeLine(" ".repeat(leftPadding)+'⚙️  Development Mode - Using Question Bank\n');
    terminal.writeLine(" ".repeat(leftPadding)+chalk.dim(longText));
    terminal.writeLine(" ".repeat(leftPadding)+chalk.dim('(Set USE_COPILOT=true in production to enable AI features)\n'));
    await delay(3000);
}