# AI Flag Detection Fix

## Problem

When running `npm run start:ai` (which uses the `--ai` flag), the app was showing a message that "AI is disabled" even though the user explicitly requested AI mode.

## Root Cause

The `config.USE_COPILOT` in `src/config/environment.ts` was being evaluated at **module load time** instead of **runtime**. This meant:

1. Modules load first
2. `config.USE_COPILOT` reads `process.env.USE_COPILOT` (which is `undefined` at this point)
3. `bin/interviewquest.ts` sets `process.env.USE_COPILOT = 'true'` (too late!)
4. The config object still has the old value

This caused the app to think AI was disabled even when the `--ai` flag was used.

## Solution

Changed the `config` object from static properties to **dynamic getters** that read the environment variable at runtime:

### Before (Static - BROKEN):
```typescript
export const config = {
  USE_COPILOT: process.env.USE_COPILOT === 'true',  // ❌ Evaluated once at load time
  IS_DEV: process.env.NODE_ENV !== 'production',
  IS_PROD: process.env.NODE_ENV === 'production'
};
```

### After (Dynamic - FIXED):
```typescript
export const config = {
  get USE_COPILOT() {
    return process.env.USE_COPILOT === 'true';  // ✅ Evaluated every time it's accessed
  },
  get IS_DEV() {
    return process.env.NODE_ENV !== 'production';
  },
  get IS_PROD() {
    return process.env.NODE_ENV === 'production';
  }
};
```

Also updated `shouldUseCopilot()` to read directly from `process.env` instead of the config object.

## How It Works Now

### Execution Flow:
1. `bin/interviewquest.ts` runs
2. Parses CLI arguments (detects `--ai` flag)
3. Sets `process.env.USE_COPILOT = 'true'`
4. Calls `startApp()`
5. App modules load and use dynamic getters
6. `config.USE_COPILOT` reads the current value of `process.env.USE_COPILOT` ✅

## Behavior After Fix

### Scenario 1: With `--ai` flag + GitHub Copilot CLI installed
**Command:** `npm run start:ai`

**Result:**
- ✅ AI mode enabled
- ✅ Generates questions using GitHub Copilot
- ✅ AI-powered evaluation
- 🎮 Full AI experience

### Scenario 2: With `--ai` flag but NO GitHub Copilot CLI
**Command:** `npm run start:ai`

**DevMode Message:**
```
⚠️  AI Mode Unavailable

GitHub Copilot CLI is not available or not configured.

Requirements:
  • Install GitHub CLI: gh --version
  • Install Copilot: gh extension install github/gh-copilot
  • Authenticate: gh auth login

→ Falling back to question bank mode...
```

### Scenario 3: Without `--ai` flag (default mode)
**Command:** `npm start`

**DevMode Message:**
```
⚙️  Development Mode - Using Question Bank

Using pre-defined questions and basic evaluation.

(Use --ai flag to enable GitHub Copilot features)
```

## Testing

### Test Case 1: Verify environment variable timing
```bash
# Should print "🤖 AI mode enabled" message
npm run start:ai
```

### Test Case 2: Without AI flag
```bash
# Should print "📚 Running in default mode" message
npm start
```

### Test Case 3: Check config at runtime
```typescript
// In any module, this will now read the current value:
console.log(config.USE_COPILOT); // Reads current process.env value
```

## Code Changes

**File:** `src/config/environment.ts`

- Changed static properties to getter functions
- Properties now evaluate at access time, not load time
- Updated `shouldUseCopilot()` to read directly from `process.env`

**File:** `src/ui/devMode.ts`

- Uses `config.USE_COPILOT` to detect if AI was requested
- Shows different messages based on user intent
- Provides helpful setup instructions when AI is unavailable

## Benefits

✅ CLI flags work correctly  
✅ Environment variables read at proper time  
✅ No race conditions between module loading and env var setting  
✅ Clear feedback about AI status  
✅ Dynamic configuration that responds to runtime changes  

## Related Files

- `src/config/environment.ts` - **FIXED:** Dynamic getters for config
- `src/ui/devMode.ts` - Updated with smart message detection
- `bin/interviewquest.ts` - Sets `USE_COPILOT` env var based on flags
- `src/evaluation/copilot.ts` - Checks if Copilot CLI is available

---

**Status:** ✅ Fixed and tested - AI flags now work correctly!
