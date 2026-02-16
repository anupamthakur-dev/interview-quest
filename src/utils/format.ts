export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  
  return `${secs}s`;
}

export function formatScore(score: number, maxScore: number = 100): string {
  const percentage = Math.round((score / maxScore) * 100);
  return `${score}/${maxScore} (${percentage}%)`;
}

export function formatXP(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`;
  }
  return `${xp} XP`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function padLeft(text: string, width: number, char: string = ' '): string {
  const padding = Math.max(0, width - text.length);
  return char.repeat(padding) + text;
}

export function padRight(text: string, width: number, char: string = ' '): string {
  const padding = Math.max(0, width - text.length);
  return text + char.repeat(padding);
}

export function center(text: string, width: number, char: string = ' '): string {
  const padding = Math.max(0, width - text.length);
  const leftPadding = Math.floor(padding / 2);
  const rightPadding = padding - leftPadding;
  
  return char.repeat(leftPadding) + text + char.repeat(rightPadding);
}
