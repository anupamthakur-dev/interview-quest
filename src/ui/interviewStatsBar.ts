import chalk from "chalk";
import { getLanguageTheme } from "../utils/helper";
import { terminal } from "./terminal";

export function interviewStatsBar(state:{level:"easy"|"medium"|"hard",tech:string,progess:{current:number,total:number}}): void {
  const level = state.level;
  const technology = state.tech;
  const progess = `question ${state.progess.current} / ${state.progess.total}`;
  const theme = getLanguageTheme(technology);
  const themeBgColor = chalk.bgHex(theme.bg).hex(theme.text);
  

const contentWidth = level.length + progess.length;

const spaceBetween: number = Math.max(0, terminal.getContentWidth() - contentWidth);

terminal.writeLine(`${level}${" ".repeat(spaceBetween)}${progess}`);
terminal.writeLine('\n');
terminal.writeLine(themeBgColor(technology));
terminal.writeLine('\n');
}