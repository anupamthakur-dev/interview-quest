# Menu and Editor Improvements

## Changes Implemented

### 1. Left-Aligned Menu Options ✨

**Before:** Each option was individually centered in the terminal
```
          ❯ 🚀 Quick Quest
       💼 Interview Mode
     🎯 Practice Grounds
            ❌ Exit
```

**After:** Menu container is centered, but options are left-aligned within it
```
                    ❯ 🚀 Quick Quest
                      💼 Interview Mode
                      🎯 Practice Grounds
                      ❌ Exit
```

**How it works:**
- Calculate the maximum width needed for all options
- Center the entire menu block
- Left-align all options within that centered block
- Consistent left edge for all options

### 2. Editor-Based Answer Input ✨

**Before:** Multi-line inline input (Ctrl+D/Z to finish)
```
Your answer (press Ctrl+D or Ctrl+Z when done):
_
(User types in terminal)
```

**After:** Opens user's preferred text editor
```
Press Enter to open your editor and write your answer...

(Notepad/nano/vim opens with question as comment)
(User types answer, saves, closes editor)
✅ Answer captured!
```

---

## Implementation Details

### Left-Aligned Menu (`select.ts`)

```typescript
const render = () => {
  // Calculate max width for the menu box
  const maxOptionLength = Math.max(...options.map(opt => {
    const fullText = opt.description ? `${opt.name} ${opt.description}` : opt.name;
    return fullText.length;
  }));
  const menuWidth = Math.min(maxOptionLength + 6, 80);
  
  // Calculate left padding to center the menu
  const leftPadding = Math.floor((terminal.getWidth() - menuWidth) / 2);

  // Render each option (left-aligned within centered menu)
  options.forEach((option, index) => {
    const padding = ' '.repeat(leftPadding);
    process.stdout.write(padding + style + line + reset + '\n');
  });
};
```

**Key changes:**
1. Calculate menu width based on longest option
2. Calculate padding once for the entire menu
3. Apply same padding to all options
4. Options are left-aligned relative to each other

### Editor Integration (`editor.ts`)

**Features:**
- ✅ Opens user's preferred editor
- ✅ Checks `$VISUAL` and `$EDITOR` environment variables
- ✅ Falls back to platform defaults (Notepad on Windows, nano on Linux/Mac)
- ✅ Creates temporary file with question as comment
- ✅ Waits for editor to close
- ✅ Reads answer from saved file
- ✅ Cleans up temporary file
- ✅ Filters out comment lines (starting with #)
- ✅ Fallback to inline input if editor fails

**Editor Selection Priority:**
1. `$VISUAL` environment variable
2. `$EDITOR` environment variable
3. Platform default:
   - Windows: `notepad`
   - macOS: `nano`
   - Linux: `nano`

**Temporary File Format:**
```
# What is event delegation and why is it useful?
# Write your answer below this line:

(User types answer here)
```

### Updated Input Flow (`input.ts`)

```typescript
export async function getUserAnswer(questionText: string, timeLimit: number): Promise<string> {
  terminal.writeLine('Press Enter to open your editor and write your answer...\n', false);
  
  rl.question('', async () => {
    try {
      // Open editor and get answer
      const answer = await openEditor(questionText);
      
      terminal.clear();
      terminal.writeLine('\n✅ Answer captured!\n');
      
      resolve(answer);
    } catch (error) {
      // Fallback to inline input if editor fails
      terminal.writeLine('Falling back to inline input...\n');
      const fallbackAnswer = await getFallbackAnswer();
      resolve(fallbackAnswer);
    }
  });
}
```

---

## User Experience

### Menu Navigation Flow

```
                    Select a mode:
                    
                    ❯ 🚀 Quick Quest
                      💼 Interview Mode
                      🎯 Practice Grounds
                      ❌ Exit
                    
          ↑↓ Navigate • Enter Select • Esc/Ctrl+C Exit
```

**Benefits:**
- ✅ Visual consistency - all options aligned
- ✅ Easier to scan - eyes don't jump around
- ✅ Professional appearance
- ✅ Menu feels like a cohesive unit

### Answer Input Flow

```
Step 1: Question is displayed
┌─────────────────────────────────────────┐
│ Q: What is event delegation?           │
│                                         │
│ Press Enter to open your editor...     │
└─────────────────────────────────────────┘

Step 2: User presses Enter
┌─────────────────────────────────────────┐
│ Notepad/nano/vim opens                  │
│                                         │
│ # What is event delegation?            │
│ # Write your answer below:             │
│                                         │
│ Event delegation is...                 │ ← User types
│                                         │
└─────────────────────────────────────────┘

Step 3: User saves and closes editor
┌─────────────────────────────────────────┐
│ ✅ Answer captured!                     │
│                                         │
│ (Game continues...)                     │
└─────────────────────────────────────────┘
```

**Benefits:**
- ✅ Full editor features (undo, syntax, etc.)
- ✅ Comfortable writing environment
- ✅ No terminal size limitations
- ✅ Familiar editing experience
- ✅ Can use user's preferred editor

---

## Setting Preferred Editor

### Windows
```powershell
# Set in PowerShell profile
$env:EDITOR = "code --wait"  # VS Code
$env:EDITOR = "notepad++"    # Notepad++
$env:EDITOR = "notepad"      # Default
```

### Linux/Mac
```bash
# Add to ~/.bashrc or ~/.zshrc
export EDITOR="nano"    # Nano (default)
export EDITOR="vim"     # Vim
export EDITOR="code -w" # VS Code
export EDITOR="emacs"   # Emacs
```

---

## Error Handling

### Editor Not Found
```
Press Enter to open your editor...

❌ Error opening editor: Command failed
Falling back to inline input...

Your answer (press Ctrl+D or Ctrl+Z when done):
_
```

### User Cancels Editor
- If user closes editor without saving, empty answer is returned
- Game continues (empty answer scores 0)

### Temporary File Issues
- Temp file is always cleaned up (even on error)
- Uses system temp directory (`os.tmpdir()`)
- Unique filename with timestamp

---

## Code Changes

### Files Modified

1. **`src/ui/select.ts`**
   - Updated `selectMenu()` to left-align options
   - Calculate menu width based on longest option
   - Apply consistent padding to all options

2. **`src/ui/input.ts`**
   - Updated `getUserAnswer()` to use editor
   - Added "Press Enter to open editor" message
   - Added fallback to inline input
   - Shows "✅ Answer captured!" after editing

### Files Created

3. **`src/ui/editor.ts`** - New file
   - `openEditor()` - Opens editor and returns content
   - `getEditor()` - Gets user's preferred editor
   - `getDefaultEditor()` - Platform-specific defaults
   - `isEditorAvailable()` - Checks if editor exists

---

## Testing

### Test Menu Alignment
```bash
npm start

# Observe:
# - Menu is centered as a whole
# - All options align on the left
# - Descriptions align consistently
# - No jagged edges
```

### Test Editor
```bash
npm start
→ Select Quick Quest
→ Select a technology
→ Press Enter when prompted
→ Editor should open (Notepad on Windows, nano on Linux/Mac)
→ Type your answer
→ Save and close editor
→ Should see "✅ Answer captured!"
```

### Test Different Editors
```bash
# Set custom editor
export EDITOR="code --wait"  # VS Code
export EDITOR="vim"          # Vim

npm start
# Your chosen editor should open
```

---

## Visual Comparison

### Menu Alignment

**Before (each line centered):**
```
              ❯ 🚀 Quick Quest
         💼 Interview Mode AI-powered realistic interview
          🎯 Practice Grounds Practice with no pressure
                    ❌ Exit Quit the application
```
❌ Jagged, hard to read, unprofessional

**After (left-aligned within centered container):**
```
                    ❯ 🚀 Quick Quest
                      💼 Interview Mode AI-powered realistic interview
                      🎯 Practice Grounds Practice with no pressure
                      ❌ Exit Quit the application
```
✅ Clean, aligned, professional

### Answer Input

**Before (inline multi-line):**
```
Your answer (press Ctrl+D or Ctrl+Z when done):

Event delegation is a technique where...
(User types in terminal, limited features)
(Need to remember Ctrl+D/Z to finish)
(Terminal width constraints)
```

**After (external editor):**
```
Press Enter to open your editor...

┌─ Notepad ───────────────────┐
│ # What is event delegation?  │
│ # Write your answer below:   │
│                               │
│ Event delegation is...        │
│ (Full editor features!)       │
│ (Syntax highlighting!)        │
│ (Unlimited width!)            │
└───────────────────────────────┘

✅ Answer captured!
```

---

## Benefits

### Menu Improvements
1. **Better Readability** - Aligned text is easier to scan
2. **Professional Look** - Feels like a polished application
3. **Visual Hierarchy** - Menu stands out as a unit
4. **Consistency** - All options aligned the same way

### Editor Improvements
1. **Better Writing Experience** - Full editor features
2. **No Size Limits** - Can write as much as needed
3. **Familiar Tools** - Use editor you know
4. **Undo/Redo** - Full editing capabilities
5. **Save Draft** - Editor auto-saves (depending on editor)

---

## Future Enhancements

### Possible Additions
- [ ] Support for editor arguments (e.g., `code --wait --new-window`)
- [ ] Syntax highlighting hint in temp file (e.g., `.md` extension)
- [ ] Editor preference configuration in app settings
- [ ] Timer countdown while editor is open
- [ ] Preview answer before submitting

---

**All features tested and working!** ✅
