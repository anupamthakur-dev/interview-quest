# Debugging Post-Game Menu Exit Issue

## Problem
User reports that the app exits immediately after mode completion without showing the menu or allowing option selection.

## Debug Steps Taken

### 1. Added Debug Messages

**In `src/game/guess-output.ts`:**
- Before calling `showPostGameMenu()`
- After menu returns with user's choice

**In `src/ui/post-game-menu.ts`:**
- When menu function starts
- When setting up keypress events
- When enabling raw mode
- Before initial render
- After render, waiting for input
- On each keypress event
- When option is selected

### 2. Verified Menu Works in Isolation
Created a test file and confirmed the menu works correctly when called independently.

### 3. Debug Messages to Look For

When running `npm start` and completing a game, you should see:

```
[DEBUG] About to show post-game menu...
[DEBUG] Post-game menu starting...
[DEBUG] Setting up keypress...
[DEBUG] Raw mode enabled
[DEBUG] About to render menu...
❯ 🔄 Continue to Play
  🏠 Home
  🚪 Exit
[DEBUG] Menu rendered, waiting for input...
[DEBUG] Key pressed: down
[DEBUG] Key pressed: return
[DEBUG] Selected option 1
[DEBUG] User chose: home
```

## Possible Causes

1. **stdin Already in Use**
   - Another readline instance might not have been properly closed
   - `getUserGuess()` creates readline interface, might not clean up properly

2. **Raw Mode Conflict**
   - If stdin is already in raw mode from previous operation
   - `setRawMode(true)` might fail silently

3. **Event Listener Conflict**
   - Multiple keypress listeners might be attached
   - Previous listener might be consuming events

4. **Promise Resolution Issue**
   - Menu promise might be resolving immediately
   - Could be a scoping or timing issue

## Next Steps

Run the app and report which [DEBUG] messages appear. This will help identify:
- Does the menu function get called?
- Does it set up keypress successfully?
- Does it render the menu?
- Does it receive keypress events?
- Where exactly does the flow break?

## To Test

```bash
npm start
# Select "Guess the Output"
# Select any technology
# Play until game over (lose all lives or wrong answers)
# Watch for [DEBUG] messages
# Report what you see
```

## Expected vs Actual

**Expected:**
- Stats display
- Menu appears below stats
- User can navigate with arrow keys
- User presses Enter to select
- Choice is returned

**Actual (Reported):**
- App exits immediately after stats
- No menu interaction possible

The debug messages will reveal exactly where the flow breaks.
