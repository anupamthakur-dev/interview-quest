# Dynamic Terminal Resize Implementation

## Overview
The terminal wrapper now supports real-time dynamic resizing with complete state preservation. Content automatically re-centers and re-renders when the terminal is resized.

## Key Features

### 1. **Real-Time Resize Handling**
- Listens to `process.stdout.on('resize')` events
- Automatically recalculates dimensions and centering
- Re-renders all persisted content instantly

### 2. **State Preservation**
- All content written with `writeLine()` or `write()` is stored
- Content is automatically re-rendered on resize
- Input prompts are NOT persisted (pass `persist: false`)

### 3. **Minimum Size Validation**
- Minimum: 60 columns × 20 rows
- Shows warning screen when terminal is too small
- Automatically restores content when resized back to valid size

### 4. **Smart Content Management**
```typescript
// Persisted content (default)
terminal.writeLine("This will be preserved on resize");

// Non-persisted content (prompts, temporary messages)
terminal.write("Enter choice: ", false);
```

## API Changes

### Terminal Wrapper (`terminal.ts`)

#### New Properties
- `currentContent: string[]` - Stores all persisted lines
- `isShowingWarning: boolean` - Tracks warning screen state
- `onResizeCallback` - Optional callback for resize events

#### Updated Methods

**write(text: string, persist: boolean = true)**
- Added `persist` parameter (default: true)
- When `persist = true`, content is stored and re-rendered on resize
- When `persist = false`, content is displayed once (for prompts)

**writeLine(text: string = '', persist: boolean = true)**
- Same persist behavior as `write()`

**writeRaw(text: string)**
- New method for raw output without centering or persistence

**clear()**
- Clears screen AND content buffer

**clearContent()**
- Clears only the content buffer (not screen)

**getContent(): string[]**
- Returns copy of current content

**restoreContent(content: string[])**
- Restores and re-renders given content

**setResizeCallback(callback: () => void)**
- Set callback to be called on resize

**clearResizeCallback()**
- Remove resize callback

### Input Functions (`input.ts`)

All input prompts now use `persist: false`:
```typescript
terminal.write(question + ' ', false); // Prompt not persisted
terminal.writeLine('Your answer:', false); // Temporary text
```

## How It Works

### Resize Flow

1. **Terminal Resizes**
   ```
   User resizes terminal → 'resize' event fires
   ```

2. **Size Validation**
   ```
   Check if new size >= minimum (60×20)
   ```

3. **Branch A: Size Too Small**
   ```
   Set isShowingWarning = true
   Show centered warning message
   Wait for valid size
   ```

4. **Branch B: Size Valid**
   ```
   Update dimensions (width, height, contentWidth, leftPadding)
   Clear screen
   Re-render all persisted content with new centering
   Call onResizeCallback if set
   ```

5. **Branch C: Restored from Warning**
   ```
   Set isShowingWarning = false
   Update dimensions
   Restore all previously persisted content
   ```

### Example Scenario

**Initial State:**
```
Terminal: 80×24
Content:
  - "Welcome to App"
  - "Menu Item 1"
  - "Menu Item 2"
```

**User Resizes to 120×30:**
```
1. Resize event fires
2. Dimensions updated: width=120, contentWidth=100
3. leftPadding recalculated: (120-100)/2 = 10
4. Screen cleared
5. Content re-rendered:
   "          Welcome to App"      (10 spaces padding)
   "          Menu Item 1"
   "          Menu Item 2"
```

**User Shrinks to 50×15:**
```
1. Resize event fires
2. Size check: 50 < 60 → INVALID
3. Content saved to buffer
4. Warning screen shown:
   "⚠️  Terminal too small!"
   "Minimum size: 60×20"
   "Current: 50×15"
```

**User Expands to 100×25:**
```
1. Resize event fires
2. Size check: 100×25 → VALID
3. isShowingWarning = false
4. Dimensions updated
5. Original content restored and re-centered
```

## Usage Examples

### Basic Screen with Auto-Resize
```typescript
import { terminal } from './ui/terminal';

// Wait for valid terminal size
await terminal.waitForValidSize();

// Write content (will be preserved on resize)
terminal.writeLine("╔═══════════════╗");
terminal.writeLine("║  My App       ║");
terminal.writeLine("╚═══════════════╝");
terminal.writeLine("");
terminal.writeLine("Select an option:");
terminal.writeLine("1. Option 1");
terminal.writeLine("2. Option 2");
terminal.writeLine("");

// Prompt (NOT preserved on resize)
terminal.write("Your choice: ", false);

// Content automatically re-centers if user resizes terminal!
```

### With Manual Content Management
```typescript
import { terminal } from './ui/terminal';

// Save content before user input
const savedContent = terminal.getContent();

// User interaction might clear screen
terminal.clear();
terminal.writeLine("Processing...");

// Later, restore original content
terminal.restoreContent(savedContent);
```

### With Resize Callback
```typescript
import { terminal } from './ui/terminal';

// Set callback for custom resize handling
terminal.setResizeCallback(() => {
  console.log('Terminal resized!');
  // Custom logic here
});

// Content still auto-renders, callback is additional
```

## Screen Manager (Optional)

For complex multi-screen apps:

```typescript
import { screenManager } from './ui/screen-manager';

// Start a new screen
screenManager.beginScreen('main-menu');
terminal.writeLine("Main Menu");
terminal.writeLine("1. Option 1");

// Switch to another screen
screenManager.beginScreen('settings');
terminal.writeLine("Settings");
terminal.writeLine("Configure app");

// Restore previous screen
screenManager.restoreScreen('main-menu');
// Original menu content is restored!
```

## Testing

### Manual Test
1. Run the app: `npm start`
2. Resize your terminal window
3. Observe content re-centering in real-time
4. Shrink below 60×20 to see warning
5. Expand again to restore content

### Verification Checklist
- ✅ Content centers on app start
- ✅ Content re-centers when terminal is expanded
- ✅ Content re-centers when terminal is shrunk (but >= 60×20)
- ✅ Warning shown when terminal < 60×20
- ✅ Content restored when terminal expanded from warning
- ✅ Input prompts work during/after resize
- ✅ No duplicate content on resize
- ✅ Wrapping adjusts to new width

## Benefits

1. **Responsive Design** - Like a web page, but in the terminal
2. **State Preservation** - Users don't lose progress when resizing
3. **Professional UX** - Handles edge cases gracefully
4. **Accessibility** - Works at various terminal sizes
5. **Developer Friendly** - Simple API, automatic behavior

## Migration Guide

### Before (Old Code)
```typescript
console.log("Hello");
console.log("World");
```

### After (New Code)
```typescript
terminal.writeLine("Hello");  // Auto-persisted, auto-centered
terminal.writeLine("World");  // Will re-render on resize
```

### For Prompts
```typescript
// Old
console.log("Enter name: ");

// New
terminal.write("Enter name: ", false);  // Not persisted
```

## Notes

- Content buffer is cleared with `terminal.clear()`
- Input prompts should use `persist: false` to avoid duplication
- Warning screen uses its own rendering (not persisted)
- Resize events trigger immediately, no debouncing needed
- Works on Windows, macOS, and Linux

---

**All content now dynamically adjusts to terminal size while preserving state!** 🎉
