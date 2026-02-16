# Arrow-Key Select Menu Implementation

## Overview
Replaced number-based selection with an intuitive **arrow-key navigation menu**. Users can now navigate with ↑/↓ arrows and press Enter to select, providing a much better UX.

## New Features

### 1. **Arrow-Key Navigation Select Menu** (`src/ui/select.ts`)

#### Features:
- ✅ **Arrow key navigation** (↑/↓ or k/j for vim users)
- ✅ **Visual selection indicator** (❯ with cyan highlight)
- ✅ **Centered in terminal** with configurable offset
- ✅ **Description support** for options (shown when not selected)
- ✅ **Keyboard hints** at bottom
- ✅ **Responsive** to terminal resize
- ✅ **Clean exit** with Esc or Ctrl+C

#### API:
```typescript
import { showSelectMenu, SelectOption } from './ui/select';

const result = await showSelectMenu({
  message: 'Select an option:',
  options: [
    { name: 'Option 1', value: 'opt1', description: 'First option' },
    { name: 'Option 2', value: 'opt2', description: 'Second option' }
  ]
});
```

### 2. **Updated Menu Flow**

#### Old Flow:
```
1. Show numbered menu
2. Type number
3. Press Enter
4. Start game
```

#### New Flow:
```
1. Show arrow-key menu for MODE
   ↓ Navigate with arrows
   ↓ Press Enter
2. Show arrow-key menu for TECHNOLOGY
   ↓ Navigate with arrows
   ↓ Press Enter
3. (For Interview Mode) Show DIFFICULTY menu
   ↓ Navigate with arrows
   ↓ Press Enter
4. Start game with selections
```

### 3. **Technology Selection**

New technology selection menu with 12 options:
- 📜 JavaScript
- 📘 TypeScript
- ⚛️ React
- 🟢 Node.js
- 🔷 Angular
- 💚 Vue.js
- 🎨 CSS
- 🌐 HTML
- 🐍 Python
- ☕ Java
- ⚙️ System Design
- 🔢 Data Structures & Algorithms

## Implementation Details

### Custom Select Menu (`select.ts`)

```typescript
export async function selectMenu(
  options: SelectOption[],
  offset: number = 0
): Promise<string>
```

**How it works:**
1. Sets up raw mode for keypress events
2. Renders options with selection indicator
3. Listens for arrow keys and Enter
4. Re-renders on navigation
5. Returns selected value on Enter
6. Cleans up and restores terminal

**Visual Example:**
```
Select a mode:

❯ 🚀 Quick Quest
  💼 Interview Mode
  🎯 Practice Grounds
  ❌ Exit

↑↓ Navigate • Enter Select • Esc/Ctrl+C Exit
```

Selected item appears with:
- ❯ indicator
- Cyan color + Bold
- No description (cleaner look)

Non-selected items show:
- Space instead of ❯
- Normal color
- Gray description text

### Updated Functions

#### `showMainMenu()` - Mode Selection
```typescript
const options: SelectOption[] = [
  { 
    name: '🚀 Quick Quest', 
    value: 'quick-quest',
    description: 'Fast-paced 5-question challenge'
  },
  // ... more options
];

return showSelectMenu({
  message: 'Select a mode:',
  options
});
```

#### `selectTechnology()` - Tech Selection
```typescript
const options: SelectOption[] = [
  { name: '📜 JavaScript', value: 'JavaScript' },
  { name: '📘 TypeScript', value: 'TypeScript' },
  // ... 10 more options
];

return showSelectMenu({
  message: 'Select your technology/topic:',
  options
});
```

#### `selectDifficulty()` - Difficulty Selection
```typescript
const options = [
  { name: '🟢 Easy', value: 'easy', description: 'Basic concepts' },
  { name: '🟡 Medium', value: 'medium', description: 'Practical applications' },
  { name: '🔴 Hard', value: 'hard', description: 'Advanced concepts' }
];

return showSelectMenu({
  message: 'Select difficulty level:',
  options
});
```

#### `askContinue()` - Yes/No Selection
```typescript
const options: SelectOption[] = [
  { name: '✅ Yes, continue playing', value: 'yes' },
  { name: '❌ No, exit', value: 'no' }
];

return showSelectMenu({
  message: 'Continue playing?',
  options
}) === 'yes';
```

## Game Flow Changes

### Quick Quest Mode
```
1. Show mode menu → Select "Quick Quest"
2. Show tech menu → Select technology (e.g., "TypeScript")
3. Start game with selected tech
4. Display: "🚀 Quick Quest Mode | 📚 Technology: TypeScript"
```

### Interview Mode
```
1. Show mode menu → Select "Interview Mode"
2. Show tech menu → Select technology
3. Show difficulty menu → Select difficulty
4. Start AI interview with selections
5. Display: "💼 Interview Mode: TypeScript - medium"
```

## Benefits

| Aspect | Before (Numbers) | After (Arrows) |
|--------|------------------|----------------|
| **Input** | Type number + Enter | Arrow + Enter |
| **Mistakes** | Easy to type wrong number | Hard to select wrong option |
| **Visual** | Plain numbered list | Highlighted selection |
| **Speed** | Need to read numbers | Navigate visually |
| **UX** | Terminal-like | App-like (modern) |
| **Accessibility** | Fine | Better (visual indicator) |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ↑ or k | Move up |
| ↓ or j | Move down |
| Enter | Select |
| Esc | Exit |
| Ctrl+C | Exit |

## Code Example - Complete Flow

```typescript
// 1. User sees mode menu
const mode = await showMainMenu();
// User navigates with arrows, presses Enter

// 2. User selects technology
const tech = await selectTechnology();
// User navigates with arrows, presses Enter

// 3. For interview mode, select difficulty
if (mode === 'interview-mode') {
  const difficulty = await selectDifficulty();
  // User navigates with arrows, presses Enter
}

// 4. Game starts with selections
await playQuickQuest(tech);
```

## Visual Flow Diagram

```
┌──────────────────────────────┐
│     Select a mode:           │
│                              │
│ ❯ 🚀 Quick Quest            │ ← User navigates
│   💼 Interview Mode         │   with arrows
│   🎯 Practice Grounds       │
│   ❌ Exit                   │
│                              │
│ ↑↓ Navigate • Enter Select  │
└──────────────────────────────┘
              ↓ Press Enter
┌──────────────────────────────┐
│ Select your technology:      │
│                              │
│ ❯ 📜 JavaScript             │ ← User navigates
│   📘 TypeScript             │   with arrows
│   ⚛️  React                 │
│   🟢 Node.js                │
│   ... (more options)         │
│                              │
│ ↑↓ Navigate • Enter Select  │
└──────────────────────────────┘
              ↓ Press Enter
┌──────────────────────────────┐
│  🚀 Quick Quest Mode         │
│                              │
│  📚 Technology: JavaScript   │
│                              │
│  Answer 5 rapid-fire         │
│  questions to earn XP!       │
└──────────────────────────────┘
```

## Technical Notes

### Raw Mode
- Enables immediate keypress detection
- No need to wait for Enter key
- Provides character-by-character input

### Cursor Management
- Positioned using ANSI escape codes `\x1B[row;colH`
- Cleared from cursor down using `\x1B[J`
- Proper cleanup on exit

### Color Codes
- Cyan: `\x1B[36m`
- Bold: `\x1B[1m`
- Gray: `\x1B[90m`
- Reset: `\x1B[0m`

### Centering
- Uses `terminal.centerText()` for consistency
- Calculates padding based on terminal width
- Respects content width limits

## Files Changed

1. **Created:**
   - `src/ui/select.ts` - Arrow-key select menu implementation

2. **Updated:**
   - `src/ui/menu-native.ts` - Uses arrow-key menus, added `selectTechnology()`
   - `src/ui/input.ts` - Updated `selectDifficulty()` to use arrow-key menu
   - `src/app/index.ts` - Added tech selection step in game flow

## Testing

Tested scenarios:
- ✅ Navigate with ↑ arrow
- ✅ Navigate with ↓ arrow
- ✅ Navigate with k (vim)
- ✅ Navigate with j (vim)
- ✅ Wrap around (bottom → top, top → bottom)
- ✅ Select with Enter
- ✅ Exit with Esc
- ✅ Exit with Ctrl+C
- ✅ Mode selection → Tech selection → Game start
- ✅ Visual indicator updates on navigation
- ✅ Description shows/hides correctly
- ✅ Centered properly on different terminal sizes

## Result

A **much more intuitive and modern** selection interface that:
- Feels like a native application
- Reduces user errors
- Provides instant visual feedback
- Enhances overall user experience

**No more typing numbers - just navigate and select!** 🎯
