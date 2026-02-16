# AI Configuration - Development vs Production

## 🎯 Quick Summary

### Local Development
```bash
npm start          # AI OFF (default)
npm run start:ai   # AI ON
```

### Production (npm install -g)
```bash
interviewquest        # AI ON (default)
interviewquest --no-ai  # AI OFF
```

---

## 📋 Complete Behavior Guide

### Development Mode (Local)

**When you're working in the project directory:**

```bash
# Default behavior - AI DISABLED
npm start
npm run dev
node dist/bin/interviewquest.js

# You'll see:
📚 Running in default mode - Use --ai flag to enable Copilot

# Enable AI
npm run start:ai
npm run dev:ai
node dist/bin/interviewquest.js --ai
interviewquest --ai  # if linked

# You'll see:
🤖 AI mode enabled - Using GitHub Copilot
```

### Production Mode (Published)

**When users install via npm:**

```bash
npm install -g interviewquest
```

**Then run:**

```bash
# Default behavior - AI ENABLED
interviewquest

# You'll see:
🤖 AI mode enabled - Using GitHub Copilot

# Disable AI if needed
interviewquest --no-ai

# You'll see:
📚 Running in default mode
```

---

## 🔄 How Detection Works

The app automatically detects the environment:

**Production Indicators:**
- `NODE_ENV=production` is set
- Running from global npm installation
- Not in a directory containing "interview-quest"

**Development Indicators:**
- Running in project directory
- `NODE_ENV` not set to production
- Directory path contains "interview-quest"

---

## 🎮 All Scenarios

### Scenario 1: Local Development - Default

```bash
cd interview-quest
npm start
```

**Result:**
- ❌ AI disabled
- ✅ Built-in questions
- 💬 Message: "Running in default mode - Use --ai flag to enable Copilot"

### Scenario 2: Local Development - With AI

```bash
cd interview-quest
npm run start:ai
# or
node dist/bin/interviewquest.js --ai
# or
interviewquest --ai  # if linked
```

**Result:**
- ✅ AI enabled
- 🤖 AI-generated questions
- 💬 Message: "AI mode enabled - Using GitHub Copilot"

### Scenario 3: Production - Default

```bash
# After: npm install -g interviewquest
interviewquest
```

**Result:**
- ✅ AI enabled by default
- 🤖 Full AI experience
- 💬 Message: "AI mode enabled - Using GitHub Copilot"

### Scenario 4: Production - Disable AI

```bash
interviewquest --no-ai
```

**Result:**
- ❌ AI disabled
- ✅ Built-in questions
- 💬 Message: "Running in default mode"

---

## 🛠️ For Developers

### Testing Both Modes Locally

```bash
# Test default mode (AI off)
npm start

# Test AI mode
npm run start:ai

# Test production behavior
NODE_ENV=production npm start  # AI on by default
NODE_ENV=production node dist/bin/interviewquest.js --no-ai  # AI off
```

### Setting Up for AI Development

```bash
# Prerequisites
gh --version                              # Check GitHub CLI
gh extension install github/gh-copilot    # Install Copilot
gh auth login                             # Authenticate

# Run with AI
npm run dev:ai
```

---

## 📝 Configuration Priority

The app checks in this order:

1. **`--no-ai` flag** → AI disabled (overrides everything)
2. **`--ai` flag** → AI enabled (overrides default)
3. **Production mode** → AI enabled by default
4. **Development mode** → AI disabled by default
5. **`USE_COPILOT` env var** → Fallback support

---

## ⚙️ Environment Variables (Still Supported)

You can still use environment variables:

**Linux/Mac:**
```bash
USE_COPILOT=true npm start
```

**Windows PowerShell:**
```powershell
$env:USE_COPILOT="true"; npm start
```

**Windows CMD:**
```cmd
set USE_COPILOT=true && npm start
```

But **flags are recommended** for clarity!

---

## 🎯 Best Practices

### For Local Development

✅ **Use default mode** for quick testing
```bash
npm start
```

✅ **Use AI mode** when testing AI features
```bash
npm run start:ai
```

### For Production Users

✅ **Default installation** gives full AI experience
```bash
npm install -g interviewquest
interviewquest  # AI enabled
```

✅ **Disable AI** if Copilot unavailable
```bash
interviewquest --no-ai
```

---

## 🐛 Troubleshooting

### "AI not working in local"

**Solution:** Use the `--ai` flag
```bash
npm run start:ai
```

### "AI always enabled in local"

**Check:**
```bash
echo $NODE_ENV  # Should not be "production"
pwd  # Should be in interview-quest directory
```

### "AI not enabled in production"

**Check:**
```bash
# Make sure installed globally
npm list -g interviewquest

# Verify Copilot setup
gh extension list
gh auth status
```

---

## 📊 Quick Reference Table

| Scenario | Command | AI Enabled? |
|----------|---------|-------------|
| Local dev | `npm start` | ❌ No |
| Local dev | `npm run start:ai` | ✅ Yes |
| Local dev | `interviewquest` (linked) | ❌ No |
| Local dev | `interviewquest --ai` | ✅ Yes |
| Production | `interviewquest` | ✅ Yes |
| Production | `interviewquest --no-ai` | ❌ No |
| Any | `interviewquest --ai` | ✅ Yes |
| Any | `interviewquest --no-ai` | ❌ No |

---

**Perfect setup for development and production!** 🚀
