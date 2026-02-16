# Running InterviewQuest - Command Reference

## 🚀 Quick Command Reference

### Basic Commands (No AI)

```bash
# Run from project directory
npm start

# Run globally (after npm link)
interviewquest
```

### With AI Features Enabled

#### Linux/Mac

```bash
# Run from project directory
USE_COPILOT=true npm start

# Run globally
USE_COPILOT=true interviewquest

# Or export it for the session
export USE_COPILOT=true
npm start  # All subsequent runs will use Copilot
```

#### Windows PowerShell

```powershell
# Run from project directory
$env:USE_COPILOT="true"; npm start

# Run globally
$env:USE_COPILOT="true"; interviewquest

# Or set it for the session
$env:USE_COPILOT="true"
npm start  # All subsequent runs will use Copilot
```

#### Windows CMD

```cmd
# Run from project directory
set USE_COPILOT=true && npm start

# Run globally
set USE_COPILOT=true && interviewquest

# Or set it for the session
set USE_COPILOT=true
npm start
```

## 📋 What's the Difference?

### Default Mode (USE_COPILOT not set)

**What happens:**
- ✅ Uses built-in question bank
- ✅ Basic answer evaluation
- ✅ Works immediately
- ✅ No external dependencies needed
- ❌ No AI-generated questions
- ❌ No AI evaluation

**Perfect for:**
- Quick practice
- Testing the app
- No internet connection
- Users without GitHub Copilot

### AI Mode (USE_COPILOT=true)

**What happens:**
- ✅ AI-generated code challenges
- ✅ Intelligent answer evaluation
- ✅ Detailed AI feedback
- ✅ More varied questions
- ⚠️ Requires GitHub Copilot CLI
- ⚠️ Requires internet connection

**Perfect for:**
- Enhanced practice experience
- Getting AI feedback
- More diverse questions
- Advanced evaluation

## 🔧 Prerequisites for AI Mode

Before enabling AI features, ensure:

1. **GitHub CLI installed**
   ```bash
   gh --version
   ```
   If not installed: https://cli.github.com/

2. **Copilot extension installed**
   ```bash
   gh extension install github/gh-copilot
   ```

3. **Authenticated with GitHub**
   ```bash
   gh auth login
   ```

## 🎯 Recommended Usage

### First Time Users
```bash
# Start with default mode
npm start
```
Get familiar with the app first!

### Regular Practice
```bash
# Use default mode for quick sessions
npm start
```
Built-in questions are great for daily practice.

### Deep Practice
```bash
# Enable AI for enhanced experience
USE_COPILOT=true npm start
```
Get AI-powered evaluation and feedback.

## 🐛 Troubleshooting

### "Copilot not found" error when USE_COPILOT=true

**Solution:**
1. Check if GitHub CLI is installed: `gh --version`
2. Check if Copilot extension is installed: `gh extension list`
3. Try authenticating: `gh auth login`

### AI features not working

**Solution:**
1. Make sure you have GitHub Copilot subscription
2. Check internet connection
3. Verify GitHub CLI works: `gh copilot --version`

### Just want it to work without setup

**Solution:**
```bash
# Simply run without USE_COPILOT
npm start
```
The app works great without AI too!

## 📝 Tips

1. **Start simple**: Run without USE_COPILOT first
2. **Test locally**: Build and run before installing globally
3. **Environment variable**: Can be set permanently in your shell config
4. **Fall back gracefully**: App detects if Copilot isn't available

## 🎮 Ready to Play?

**Quick start (works immediately):**
```bash
git clone https://github.com/anupamthakur-dev/interview-quest.git
cd interview-quest
npm install && npm run build
npm start
```

**With AI (if you have Copilot):**
```bash
USE_COPILOT=true npm start  # Linux/Mac
$env:USE_COPILOT="true"; npm start  # Windows PowerShell
```

---

**Remember:** The app works perfectly fine without AI features! Only enable if you want enhanced AI capabilities. 🚀
