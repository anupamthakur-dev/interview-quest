# Dynamic Terminal Resize - How It Works

## Live Example

When you run the app and resize your terminal, here's what happens:

### Scenario 1: Expanding the Terminal

**Initial State (80×24):**
```
                    ╔═══════════════════════════════════╗
                    ║     INTERVIEW QUEST               ║
                    ╚═══════════════════════════════════╝
                    
                    Select a mode:
                    
                      1. 🚀 Quick Quest
                      2. 💼 Interview Mode
                      3. 🎯 Practice Grounds
                      4. ❌ Exit
```

**User Resizes to 120×30:**
```
                              ╔═══════════════════════════════════╗
                              ║     INTERVIEW QUEST               ║
                              ╚═══════════════════════════════════╝
                              
                              Select a mode:
                              
                                1. 🚀 Quick Quest
                                2. 💼 Interview Mode
                                3. 🎯 Practice Grounds
                                4. ❌ Exit
```
**✅ Content automatically re-centers with more padding!**

---

### Scenario 2: Shrinking Below Minimum

**Current State (80×24):**
```
                    ╔═══════════════════════════════════╗
                    ║     INTERVIEW QUEST               ║
                    ╚═══════════════════════════════════╝
                    
                    Select a mode:
                    
                      1. 🚀 Quick Quest
                      2. 💼 Interview Mode
```

**User Resizes to 50×15 (below minimum 60×20):**
```
            ⚠️  Terminal too small!
            
            Minimum size: 60×20
            Current: 50×15
            
            Please resize your terminal to continue.
```
**✅ Content is saved and warning is shown!**

---

### Scenario 3: Restoring from Warning

**Current State (50×15 - Warning Shown):**
```
            ⚠️  Terminal too small!
            
            Minimum size: 60×20
            Current: 50×15
```

**User Resizes to 80×24 (valid size):**
```
                    ╔═══════════════════════════════════╗
                    ║     INTERVIEW QUEST               ║
                    ╚═══════════════════════════════════╝
                    
                    Select a mode:
                    
                      1. 🚀 Quick Quest
                      2. 💼 Interview Mode
                      3. 🎯 Practice Grounds
                      4. ❌ Exit
                    
                    Enter your choice (1-4): _
```
**✅ Original content is restored with the user's input position intact!**

---

## Technical Details

### What Happens Behind the Scenes

1. **Content Storage**
   ```typescript
   // Every call to writeLine() stores the content
   terminal.writeLine("Hello");  // Stored in currentContent[]
   ```

2. **Resize Event**
   ```typescript
   process.stdout.on('resize', () => {
     // 1. Get new dimensions
     this.width = process.stdout.columns;
     this.height = process.stdout.rows;
     
     // 2. Validate size
     if (this.width < 60 || this.height < 20) {
       this.showResizeWarning();
     } else {
       // 3. Recalculate padding
       this.updateDimensions();
       
       // 4. Re-render all content
       this.rerender();
     }
   });
   ```

3. **Re-rendering**
   ```typescript
   private rerender(): void {
     console.clear();
     this.currentContent.forEach(line => {
       const padding = ' '.repeat(this.leftPadding);
       process.stdout.write(padding + line + '\n');
     });
   }
   ```

### Persistence Control

**Persisted Content (default):**
```typescript
terminal.writeLine("Menu Item 1");  // Will survive resize
terminal.writeLine("Menu Item 2");  // Will survive resize
```

**Non-Persisted Content (prompts):**
```typescript
terminal.write("Enter choice: ", false);  // Won't survive resize
// This prevents prompts from duplicating on resize
```

## Code Examples

### Example 1: Simple Menu
```typescript
import { terminal } from './ui/terminal';
import { getUserInput } from './ui/input';

async function showMenu() {
  await terminal.waitForValidSize();
  
  terminal.clear();
  terminal.writeLine("╔════════════╗");
  terminal.writeLine("║  MY APP    ║");
  terminal.writeLine("╚════════════╝");
  terminal.writeLine("");
  terminal.writeLine("1. Option A");
  terminal.writeLine("2. Option B");
  terminal.writeLine("");
  
  // Prompt is not persisted
  const choice = await getUserInput("Your choice:");
  
  // If user resizes during input, menu stays centered!
}
```

### Example 2: Progress Display
```typescript
async function showProgress() {
  terminal.clear();
  terminal.writeLine("Processing tasks...");
  terminal.writeLine("");
  
  for (let i = 1; i <= 5; i++) {
    terminal.writeLine(`✅ Task ${i} completed`);
    await delay(1000);
    // If user resizes, all completed tasks stay visible and centered!
  }
}
```

### Example 3: With Resize Callback
```typescript
let resizeCount = 0;

terminal.setResizeCallback(() => {
  resizeCount++;
  console.log(`Terminal resized ${resizeCount} times`);
});

terminal.writeLine("Resize the terminal to see the counter update!");
// Content stays centered, callback triggers on each resize
```

## User Experience Flow

```
User opens app
    ↓
Terminal validated (>= 60×20)
    ↓
Content displayed (centered)
    ↓
User resizes terminal → Content re-centers automatically ✨
    ↓
User shrinks too small → Warning shown, content saved ✨
    ↓
User expands again → Content restored, perfectly centered ✨
    ↓
User continues interacting → Everything still centered! 🎉
```

## Key Advantages

1. **Zero Configuration** - Just use `terminal.writeLine()` and it works
2. **Automatic** - No manual refresh or re-render needed
3. **Preserves State** - Users never lose their progress
4. **Graceful Degradation** - Shows helpful message when too small
5. **Instant Feedback** - Re-centers immediately on resize
6. **Selective Persistence** - Control what survives resize with `persist` flag

## Try It Yourself!

```bash
# Run the app
npm start

# Then try:
1. Resize your terminal wider → Content centers with more space
2. Resize narrower → Content centers with less space
3. Shrink below 60×20 → See the warning
4. Expand again → Original content restored!
```

**The content adjusts instantly and smoothly! 🚀**
