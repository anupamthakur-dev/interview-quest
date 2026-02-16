import { getTerminalSize } from "../app/environment";
import { terminal } from "../ui/terminal";
import { stripVTControlCharacters } from "util";
import figlet from "figlet";
import chalk from "chalk";

export function verticalPad(
  contentHeight: number,
  terminalHeight: number
) {
  return Math.max(
    Math.floor((terminalHeight - contentHeight) / 2),
    0
  );
}

export function centerLine(line: string, width: number) {
  const padding = Math.max(
    Math.floor((width - line.length) / 2),
    0
  );
  return ' '.repeat(padding) + line;
}



export function renderCenteredScreen(lines: string[]) {
  const { width, height } = getTerminalSize();

  terminal.clear();
   
  [" "].forEach(line => {
    terminal.writeLine(centerLine(line, width));
  });
  lines.forEach(line => {
    terminal.writeLine(centerLine(line, width));
  });
}



export function getVisualWidth(str: string): number {
  // 1. Remove ANSI codes
  const plain = stripVTControlCharacters(str);
  // 2. Spread the string to correctly count surrogate pairs (emojis)
  // Note: This isn't perfect for all terminals but better than .length
  return [...plain].reduce((width, char) => {
    // Basic check: Most emojis/special chars are in high ranges and take 2 spaces
    return width + (char.codePointAt(0)! > 0xFFFF ? 2 : 1);
  }, 0);
}
 
interface IGetLanguageReturn{
  bg:string,
  text:string
}

export function getLanguageTheme(language:string):IGetLanguageReturn {
  const themes:Record<string,{bg:string,text:string}> = {
    JavaScript: { bg: "#F7DF1E", text: "#000000" },
    TypeScript: { bg: "#3178C6", text: "#FFFFFF" },
    React: { bg: "#61DAFB", text: "#000000" },
    "Node.js": { bg: "#339933", text: "#FFFFFF" },
    Angular: { bg: "#DD0031", text: "#FFFFFF" },
    "Vue.js": { bg: "#4FC08D", text: "#000000" },
    CSS: { bg: "#1572B6", text: "#FFFFFF" },
    HTML: { bg: "#E34F26", text: "#FFFFFF" },
    Python: { bg: "#3776AB", text: "#FFFFFF" },
    Java: { bg: "#007396", text: "#FFFFFF" },
    "System Design": { bg: "#6B7280", text: "#FFFFFF" },
    DSA: { bg: "#8B5CF6", text: "#FFFFFF" }
  };

  return (
    themes[language] || {
      bg: "#000000",
      text: "#FFFFFF"
    }
  );
}

export async function horiCenterFiglet(str:string,color:string):Promise<number>{
   const figletStr = await figlet.text(str,{horizontalLayout:'full'});
   const lines = figletStr.split('\n').map((line)=>line);
   const textColor = chalk.hex(color);
   const paddedLines = lines.map((line)=> terminal.centerText(line)).join('\n');
  terminal.writeLine(textColor(paddedLines))
  
  return lines.length || 0;
}
