# Post-Game Menu Implementation

## Feature
Added a post-game menu that appears **BELOW the final statistics** after completing any game mode, allowing players to:
- **Continue to Play** - Start a new game in the same mode with the same technology
- **Home** - Return to the main menu to select a different mode
- **Exit** - Exit the application

## Key Features

✅ **Results Stay Visible** - Final stats remain on screen above the menu  
✅ **No Auto-Exit** - App only exits when user explicitly chooses "Exit"  
✅ **Arrow-Key Navigation** - Consistent with rest of the app  
✅ **No Screen Clearing** - Menu appears below stats without clearing them

## User Experience

After completing any game mode, you see:

```
╔════════════════════════════════════════════════════════╗
║                    🏁 GAME OVER!                       ║
╠════════════════════════════════════════════════════════╣
║  📊 Final Statistics:                                  ║
║     Technology: JavaScript                             ║
║     Final Score: 150                                   ║
║     Correct Guesses: 15/18                             ║
║     Accuracy: 83.3%                                    ║
║     Highest Difficulty: HARD                           ║
╚════════════════════════════════════════════════════════╝

What would you like to do?

  ❯ 🔄 Continue to Play
    🏠 Home
    🚪 Exit
```

The stats remain visible while you make your choice!

## Changes Made

### 1. Custom Post-Game Menu (No Screen Clearing)
**File:** `src/ui/post-game-menu.ts`

- Completely custom implementation (doesn't use generic selectMenu)
- Renders menu inline without clearing screen
- Uses cursor positioning to redraw menu on selection change
- Preserves all content above it

Key differences from standard menu:
```typescript
// Don't clear screen - menu appears below stats
terminal.writeLine('What would you like to do?\n', false);

// Only redraw menu items, not entire screen
const render = () => {
  // Move cursor up to redraw menu
  process.stdout.write(`\x1B[${options.length + 1}A`);
  
  // Render each option in place
  options.forEach((option, index) => {
    // ...
  });
};
```

### 2. Fixed Exit Behavior
**File:** `src/app/index.ts`

The app now properly handles exit:
```typescript
while (running) {
  // ... show menu, play game ...
  
  const postGameChoice = await handleGameMode(selectedMode);

  if (postGameChoice === 'exit') {
    clearScreen();
    terminal.writeLine('\n👋 Thanks for playing!\n');
    break; // Exit loop only when user chooses Exit
  }
  // 'continue' and 'home' automatically loop back
}
```

**Before:** `process.exit(0)` - immediate exit  
**After:** `break` - clean loop exit only when chosen

### 3. Enhanced Final Stats Display

**Guess the Output Mode:**
```typescript
async function showFinalStats(state: GuessGameState): Promise<void> {
  clearScreen();
  
  terminal.writeLine('\n' + '═'.repeat(60));
  terminal.writeLine('🏁 GAME OVER!');
  terminal.writeLine('═'.repeat(60));
  terminal.writeLine(`\n📊 Final Statistics:`);
  terminal.writeLine(`   Technology: ${state.technology}`);
  terminal.writeLine(`   Final Score: ${state.score}`);
  terminal.writeLine(`   Correct Guesses: ${state.totalCorrect}/${state.totalAttempts}`);
  terminal.writeLine(`   Accuracy: ${state.totalAttempts > 0 ? ((state.totalCorrect / state.totalAttempts) * 100).toFixed(1) : 0}%`);
  terminal.writeLine(`   Highest Difficulty: ${state.difficulty.toUpperCase()}`);
  terminal.writeLine('\n' + '═'.repeat(60) + '\n');
  // Menu appears right after this
}
```

**Interview Mode:**
```typescript
// Show summary
await showGameSummary(engine, scoringSystem);

// Show additional details
terminal.writeLine(`\n📚 Topic: ${selectedTech}`);
terminal.writeLine(`⚡ Difficulty: ${selectedDifficulty}`);
if (hintsUsed > 0) {
  terminal.writeLine(`💡 Hints used: ${hintsUsed}`);
}
terminal.writeLine(''); // Spacing before menu

// Menu appears right after
return await showPostGameMenu();
```

## Choice Behaviors

### 🔄 Continue to Play
- Starts a new game immediately
- **Same mode** (e.g., Guess the Output)
- **Same technology** (e.g., JavaScript)
- Fresh stats (lives, score reset)

### 🏠 Home
- Returns to main menu
- Can select different mode
- Can select different technology
- Banner displayed again

### 🚪 Exit
- Shows goodbye message
- Exits the application cleanly
- **This is the ONLY way the app exits**

## Technical Implementation

### Menu Rendering Without Clearing
```typescript
const render = () => {
  // Move cursor up to menu start position
  if (selectedIndex > 0 || !isActive) {
    process.stdout.write(`\x1B[${options.length + 1}A`);
  }
  
  // Render each option (clearing only that line)
  options.forEach((option, index) => {
    const isSelected = index === selectedIndex;
    const prefix = isSelected ? '❯' : ' ';
    const style = isSelected ? '\x1B[36m\x1B[1m' : '\x1B[0m';
    
    process.stdout.write('\x1B[2K'); // Clear line
    terminal.write(`  ${style}${prefix} ${option.name}\x1B[0m\n`, false);
  });
};
```

### Arrow Key Navigation
- ↑/k - Move up
- ↓/j - Move down
- Enter - Select
- Ctrl+C - Emergency exit

### Clean Stdin Handling
```typescript
const cleanup = () => {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
  process.stdin.removeListener('keypress', onKeyPress);
};
```

## Files Modified

1. **src/ui/post-game-menu.ts** - Complete rewrite with inline rendering
2. **src/game/guess-output.ts** - Enhanced stats display
3. **src/app/index.ts** - Fixed exit behavior with `break` instead of `process.exit()`

## Benefits

✅ **Clear Results** - Stats always visible during decision  
✅ **No Confusion** - App only exits when you say so  
✅ **Better UX** - No rushed reading or unexpected exits  
✅ **Consistent** - Same experience across all modes  
✅ **Responsive** - Clean keyboard navigation

## Testing Checklist

- ✅ Stats display completely before menu
- ✅ Menu appears below stats (no clearing)
- ✅ Arrow keys navigate properly
- ✅ Continue → new game with same mode/tech
- ✅ Home → returns to mode selection
- ✅ Exit → shows goodbye and quits
- ✅ No accidental exits
- ✅ Works for both Guess Output and Interview modes

