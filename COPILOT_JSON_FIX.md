# Copilot JSON Parsing Fix

## Problem
The Guess the Output mode was failing with JSON parsing errors:
```
Error generating challenge: Error: Failed to parse Copilot response: SyntaxError: Expected property name or '}' in JSON at position 6
```

Then after initial fix:
```
Error: Command failed: gh copilot suggest "..."
error: Invalid command format.
```

## Root Causes

### 1. Incorrect Copilot Command Format
**Wrong:** `copilot -p "prompt"`  
**Wrong:** `gh copilot suggest "prompt"`  
**Correct:** `gh copilot -p "prompt"`

The GitHub Copilot CLI requires the `-p` or `--prompt` flag for non-interactive mode.

### 2. Unreliable JSON Parsing
Copilot responses can include:
- Markdown code blocks (```json ... ```)
- Extra explanatory text
- Formatted output with whitespace

The parsing needed to be more robust.

## Solutions Implemented

### 1. Fixed Copilot Command
```typescript
// src/evaluation/copilot.ts - askCopilot method
const command = `gh copilot -p "${escapedPrompt}"`;
```

This uses the correct format as suggested by the CLI error message.

### 2. Robust JSON Extraction
```typescript
// Remove markdown blocks
let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');

// Extract JSON object
const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

// Validate required fields
if (!parsed.code || !parsed.output) {
  throw new Error('Missing required fields');
}
```

### 3. Fallback System
Added predefined challenges for when Copilot fails:

```typescript
const FALLBACK_CHALLENGES: Record<string, CodeChallenge[]> = {
  'JavaScript': [
    {
      code: 'let x = 5 + 3;\nconsole.log(x);',
      expectedOutput: '8',
      difficulty: 'easy',
      technology: 'JavaScript',
      explanation: 'Simple addition: 5 + 3 = 8'
    },
    // ... more challenges
  ],
  'Python': [ /* ... */ ]
};
```

If Copilot generation or parsing fails, the system automatically falls back to predefined challenges.

### 4. Better Error Messages
Instead of crashing, the app now shows:
```
⚠️  AI generation failed, using fallback challenge...
```

## Files Changed

1. **src/evaluation/copilot.ts**
   - Fixed `askCopilot()` to use correct `gh copilot -p` command
   - Added proper stdio configuration

2. **src/game/guess-output.ts**
   - Added `FALLBACK_CHALLENGES` with predefined challenges
   - Enhanced `generateCodeChallenge()` with robust JSON parsing
   - Added `getFallbackChallenge()` function
   - Automatic fallback on AI failure

## Testing

The fix handles multiple scenarios:
- ✅ Copilot unavailable → Uses fallback
- ✅ Invalid JSON response → Cleans and extracts
- ✅ Missing fields → Uses fallback
- ✅ Parsing errors → Uses fallback
- ✅ Command errors → Uses fallback

## Copilot CLI Usage

The correct command format is:
```bash
# Interactive mode
gh copilot -i "your prompt"

# Non-interactive mode (what we use)
gh copilot -p "your prompt"

# Get help
gh copilot --help
```

## Usage

No changes required for users. The game will:
1. Try to generate AI challenges first (using `gh copilot -p`)
2. Fall back to predefined challenges if AI fails
3. Continue smoothly without crashing

Users can still enjoy the game even if Copilot CLI is not configured!

