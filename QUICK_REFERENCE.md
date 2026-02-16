# Quick Reference - Terminal Wrapper API

## Basic Usage

```typescript
import { terminal } from './ui/terminal';
```

## Common Methods

### Writing Content

```typescript
// Write and persist (will survive resize)
terminal.writeLine("Hello World");
terminal.writeLine(""); // Empty line

// Write without persistence (for prompts)
terminal.write("Enter name: ", false);

// Raw output (no centering, no persistence)
terminal.writeRaw("Raw text\n");
```

### Screen Management

```typescript
// Clear screen and content buffer
terminal.clear();

// Clear only content buffer (not screen)
terminal.clearContent();
```

### Content State

```typescript
// Get current content
const content = terminal.getContent();

// Restore content
terminal.restoreContent(content);
```

### Terminal Info

```typescript
// Get dimensions
const width = terminal.getWidth();        // e.g., 80
const height = terminal.getHeight();      // e.g., 24
const contentWidth = terminal.getContentWidth(); // e.g., 76

// Check if size is valid
const isValid = terminal.isTerminalSizeValid(); // true/false
```

### Centering

```typescript
// Center text manually
const centered = terminal.centerText("My Text");
terminal.writeLine(centered);
```

### Resize Handling

```typescript
// Wait for valid terminal size
await terminal.waitForValidSize();

// Set callback for resize events
terminal.setResizeCallback(() => {
  console.log('Terminal resized!');
});

// Clear callback
terminal.clearResizeCallback();
```

## Input Functions

```typescript
import { 
  getUserInput, 
  getUserAnswer, 
  askYesNo, 
  selectFromList,
  selectTopic,
  selectDifficulty,
  pressAnyKey
} from './ui/input';

// Simple text input
const name = await getUserInput("Enter your name:");

// Multi-line input (Ctrl+D/Z to finish)
const answer = await getUserAnswer("Question?", 120);

// Yes/No question
const confirmed = await askYesNo("Continue?", true); // default: true

// List selection
const choice = await selectFromList("Choose:", [
  { name: "Option 1", value: "opt1" },
  { name: "Option 2", value: "opt2" }
]);

// Topic selection
const topic = await selectTopic(["JavaScript", "TypeScript"]);

// Difficulty selection
const diff = await selectDifficulty(); // Returns 'easy' | 'medium' | 'hard'

// Wait for Enter key
await pressAnyKey("Press Enter to continue...");
```

## Select Menu Functions ✨ NEW!

```typescript
import { showSelectMenu, SelectOption } from './ui/select';

// Basic select menu
const result = await showSelectMenu({
  message: 'Choose an option:',
  options: [
    { name: 'Option 1', value: 'opt1', description: 'First choice' },
    { name: 'Option 2', value: 'opt2', description: 'Second choice' }
  ]
});

// Example: Mode selection with arrow keys
const mode = await showMainMenu(); // Returns 'quick-quest' | 'interview-mode' | etc.

// Example: Technology selection
const tech = await selectTechnology(); // Returns 'JavaScript' | 'TypeScript' | etc.

// Example: Difficulty selection
const difficulty = await selectDifficulty(); // Returns 'easy' | 'medium' | 'hard'

// Example: Yes/No with arrow keys
const shouldContinue = await askContinue(); // Returns true/false
```

### Navigation
- ↑ or k - Move up
- ↓ or j - Move down
- Enter - Select
- Esc/Ctrl+C - Exit

## Menu Functions

```typescript
import { showMainMenu, askContinue } from './ui/menu-native';

// Show main menu
const mode = await showMainMenu(); // Returns selected mode

// Ask to continue
const shouldContinue = await askContinue(); // true/false
```

## Screen Manager (Optional)

```typescript
import { screenManager } from './ui/screen-manager';

// Begin a new screen
screenManager.beginScreen('menu');
terminal.writeLine("Menu content here");

// End current screen
screenManager.endScreen();

// Restore a previous screen
screenManager.restoreScreen('menu');

// Refresh current screen (useful after resize)
screenManager.refreshCurrentScreen();
```

## Common Patterns

### Pattern 1: Simple Menu
```typescript
await terminal.waitForValidSize();
terminal.clear();

terminal.writeLine("╔══════════╗");
terminal.writeLine("║  MENU    ║");
terminal.writeLine("╚══════════╝");
terminal.writeLine("");
terminal.writeLine("1. Start");
terminal.writeLine("2. Exit");
terminal.writeLine("");

const choice = await getUserInput("Choice:");
```

### Pattern 2: Progress Display
```typescript
terminal.clear();
terminal.writeLine("Loading...");
terminal.writeLine("");

for (let i = 1; i <= 5; i++) {
  terminal.writeLine(`✅ Step ${i}`);
  await delay(500);
}
```

### Pattern 3: Question & Answer
```typescript
terminal.clear();
terminal.writeLine("Question 1 of 5");
terminal.writeLine("");
terminal.writeLine("Q: What is TypeScript?");
terminal.writeLine("");

const answer = await getUserAnswer("Your answer:", 60);

terminal.writeLine("");
terminal.writeLine("✅ Answer recorded!");
```

### Pattern 4: Centered Banner
```typescript
const banner = [
  "╔═══════════╗",
  "║  MY APP   ║",
  "╚═══════════╝"
];

banner.forEach(line => {
  terminal.writeLine(terminal.centerText(line));
});
```

## Best Practices

### ✅ DO

- Use `terminal.writeLine()` for all persistent content
- Use `persist: false` for prompts and temporary messages
- Call `terminal.waitForValidSize()` at app startup
- Clear screen before showing new content
- Let the terminal handle centering automatically

### ❌ DON'T

- Don't use `console.log()` - use `terminal.writeLine()` instead
- Don't persist prompts (use `persist: false`)
- Don't manually calculate padding - let terminal handle it
- Don't fight the automatic centering
- Don't assume a fixed terminal size

## Resize Behavior

| Event | What Happens |
|-------|-------------|
| Terminal expands | Content re-centers with more padding |
| Terminal shrinks (valid size) | Content re-centers with less padding |
| Terminal shrinks (< 60×20) | Warning shown, content saved |
| Terminal expands from warning | Original content restored and centered |
| During user input | Resize still works, input continues |

## Constants

```typescript
MIN_TERMINAL_WIDTH = 60;  // columns
MIN_TERMINAL_HEIGHT = 20; // rows
MAX_CONTENT_WIDTH = 100;  // columns
```

## TypeScript Types

```typescript
// All methods return proper types
const width: number = terminal.getWidth();
const isValid: boolean = terminal.isTerminalSizeValid();
const content: string[] = terminal.getContent();

// Input functions are fully typed
const difficulty: 'easy' | 'medium' | 'hard' = await selectDifficulty();
const confirmed: boolean = await askYesNo("Continue?");
const answer: string = await getUserInput("Name:");
```

---

**Quick Tip**: Just use `terminal.writeLine()` for everything and let it handle centering and resize automatically! 🎯
