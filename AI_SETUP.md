# Running with AI - Quick Guide

## ✨ AI Behavior: Development vs Production

### 🏠 Local Development (Default: AI OFF)
When running locally in the project directory:
- AI is **DISABLED** by default
- Use `--ai` flag to enable
- Great for testing without Copilot

### 🚀 Production (Default: AI ON)
When installed via npm globally:
- AI is **ENABLED** by default
- Use `--no-ai` flag to disable
- Full AI experience for end users

## 🚀 How to Run with AI

### In Local Development

```bash
# Enable AI with flag
npm run start:ai
npm run dev:ai

# Or direct
node dist/bin/interviewquest.js --ai

# Or globally if linked
interviewquest --ai
```

### In Production (After Publishing)

```bash
# AI is enabled by default!
interviewquest

# Disable if needed
interviewquest --no-ai
```

## 📋 All Available Flags

```bash
# Help
interviewquest --help
interviewquest -h

# Version
interviewquest --version
interviewquest -v

# Enable AI
interviewquest --ai       # Full flag
interviewquest --copilot  # Alternative
interviewquest -c         # Short form

# Disable AI (production only)
interviewquest --no-ai
```

## ⚙️ Prerequisites for AI Mode

Before using `--ai` flag, make sure you have:

1. **GitHub CLI installed**
   ```bash
   gh --version
   ```
   If not: https://cli.github.com/

2. **Copilot extension**
   ```bash
   gh extension install github/gh-copilot
   ```

3. **Authenticated**
   ```bash
   gh auth login
   ```

4. **GitHub Copilot subscription**
   - Personal account with Copilot
   - Or organization access

## 🎯 Quick Start Examples

### Basic Usage (No AI)

```bash
# Clone and setup
git clone https://github.com/anupamthakur-dev/interview-quest.git
cd interview-quest
npm install && npm run build

# Run normally
npm start
```

### With AI Features

```bash
# After setup above
npm run start:ai

# Or if installed globally
npm link
interviewquest --ai
```

## 💡 What's the Difference?

### Default Mode (no flag)
```bash
interviewquest
```
- ✅ Uses built-in question bank
- ✅ Basic evaluation
- ✅ Works offline
- ✅ No setup required

### AI Mode (--ai flag)
```bash
interviewquest --ai
```
- ✅ AI-generated questions
- ✅ Intelligent evaluation
- ✅ Detailed feedback
- ⚠️ Requires Copilot setup
- ⚠️ Requires internet

## 🔧 Troubleshooting

### "Copilot not found"

**Check installations:**
```bash
gh --version                # Should show version
gh extension list           # Should list copilot
gh auth status             # Should show logged in
```

**Fix:**
```bash
gh extension install github/gh-copilot
gh auth login
```

### AI flag not working

**Make sure you:**
1. Built the project: `npm run build`
2. Have Copilot subscription
3. Are authenticated: `gh auth status`

### Want to verify it's working?

When you start with `--ai`, you should see:
```
🤖 AI mode enabled - Using GitHub Copilot
```

## 📝 Pro Tips

### For Development

```bash
# Quick iteration with AI
npm run dev:ai
```

### For Testing Both Modes

```bash
# Test default mode
npm start

# Test AI mode
npm run start:ai
```

### For Global Installation

```bash
# Link once
npm link

# Then use anywhere
interviewquest        # Default mode
interviewquest --ai   # AI mode
```

## 🎮 Ready to Go!

**Quick test:**
```bash
# Show help
interviewquest --help

# Show version
interviewquest --version

# Run default mode
interviewquest

# Run with AI
interviewquest --ai
```

---

**Now you can easily toggle AI on/off with just a flag!** 🚀
