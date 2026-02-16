---
title: InterviewQuest - A Terminal-Based Interview Simulator for Developers
published: false
description: Practice coding interviews in your terminal with this gamified CLI application. Features adaptive difficulty, lives system, and AI-powered evaluation.
tags: cli, interview, terminal, nodejs
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/your-cover-image.png
---

# 🎮 InterviewQuest: Level Up Your Interview Skills in the Terminal

Ever wished you could practice coding interviews without leaving your terminal? Meet **InterviewQuest** - a gamified, terminal-based interview simulator that makes practicing technical interviews actually fun!

## 🌟 What is InterviewQuest?

InterviewQuest is a production-quality CLI application that helps developers practice technical interview questions in a gamified environment. Think of it as a terminal game meets interview prep - with lives, streaks, and adaptive difficulty!

### ✨ Key Features

- 🎯 **Guess the Output Mode** - Analyze code snippets and predict their output
- 💝 **Lives System** - Start with 3 hearts, lose one on wrong answers
- 🔥 **Streak Bonuses** - Get 3 correct in a row to level up difficulty
- 📊 **Score Tracking** - Track your progress and accuracy
- 🧠 **Adaptive Difficulty** - Automatically adjusts based on your performance
- 🎨 **Beautiful UI** - Centered, colorful terminal interface with animations
- ⚡ **Zero Dependencies** - Minimal, fast, and reliable
- 🤖 **AI Integration** - Optional GitHub Copilot support for evaluation

## 🎬 Demo

```bash
┌─────────────────────────────────────────────┐
│           GUESS THE OUTPUT                  │
├─────────────────────────────────────────────┤
│ EASY  Score: 100    🔥🔥  ❤️ ❤️ ❤️         │
├─────────────────────────────────────────────┤
│                                             │
│  What will this code output?               │
│                                             │
│  const arr = [1, 2, 3];                    │
│  console.log(arr.length);                  │
│                                             │
│  Your guess: _                             │
│                                             │
└─────────────────────────────────────────────┘

🤖 AI is evaluating your answer...
```

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** >= 18
- **Git**
- **Terminal** with minimum size 60x20

## 🚀 Installation & Setup

Since the app isn't published on npm yet, you can run it directly from the GitHub repository:

### Method 1: Clone and Run (Recommended)

```bash
# Clone the repository
git clone https://github.com/anupamthakur-dev/interview-quest.git

# Navigate to the directory
cd interview-quest

# Install dependencies
npm install

# Build the project
npm run build

# Run the game (default mode - no AI)
npm start

# Or run with AI features enabled
npm run start:ai

# Alternative: direct command with AI
node dist/bin/interviewquest.js --ai
```

> **Note:** In local development, AI is **disabled by default**. Use `npm run start:ai` or add the `--ai` flag to enable GitHub Copilot features.

### Method 2: Install Globally (Local Development)

```bash
# Clone and navigate
git clone https://github.com/anupamthakur-dev/interview-quest.git
cd interview-quest

# Install dependencies and build
npm install
npm run build

# Link globally
npm link

# Now you can run it from anywhere!
interviewquest

# Or with AI features
interviewquest --ai
```

To unlink later:
```bash
npm unlink -g interviewquest
```

> **Tip:** When installed globally via npm (after publishing), AI features will be **enabled by default**. In local development, use the `--ai` flag to enable them.

## 🎮 How to Play

### Starting the Game

```bash
npm start
```

### Game Modes

#### 1. Guess the Output 🎯

The main game mode where you:
1. View a code snippet
2. Predict what it will output
3. Submit your guess (multi-line supported!)
4. Get instant feedback

**Lives System:**
- Start with 3 hearts ❤️ ❤️ ❤️
- Lose one on wrong answer
- Game over when you run out!

**Streak Bonuses:**
- Get 3 correct in a row 🔥🔥🔥
- Difficulty automatically increases
- Earn bonus points!

**Difficulty Levels:**
- 🟢 **Easy** - Basic concepts
- 🟡 **Medium** - Practical applications  
- 🔴 **Hard** - Advanced concepts

#### 2. Interview Mode 🎤 (Coming Soon)
- Realistic interview simulation
- Timed challenges
- AI evaluation with detailed feedback

#### 3. Practice Grounds 📚 (Coming Soon)
- Unlimited practice
- No time pressure
- Learn at your own pace

## ⌨️ Controls

### In-Game Controls

**Guess the Output:**
- Type your answer
- Press `Enter` for new line
- Press `Ctrl+S` to submit
- Use arrow keys to navigate

**Menus:**
- Use `↑` `↓` arrow keys to navigate
- Press `Enter` to select
- Press `Esc` or `Ctrl+C` to exit

## 🛠️ Tech Stack

Built with modern, minimal dependencies:

- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment
- **Chalk** - Terminal styling
- **Figlet** - ASCII art headers
- **Custom Terminal Wrapper** - Responsive, centered UI

**Architecture:**
- Modular, scalable structure
- Custom animations (no heavy libraries!)
- Native readline for input
- Clean separation of concerns

## 📁 Project Structure

```
interview-quest/
├── bin/
│   └── interviewquest.ts        # Entry point
├── src/
│   ├── app/                     # App initialization
│   ├── ui/                      # Terminal UI components
│   ├── game/                    # Game logic & modes
│   ├── questions/               # Question bank
│   ├── evaluation/              # Answer evaluation
│   └── utils/                   # Utilities
└── dist/                        # Compiled output
```

## 🎨 Screenshots

### Main Menu
```
╔═══════════════════════════════════════╗
║     INTERVIEW QUEST                   ║
╚═══════════════════════════════════════╝

❯ 🎯 Guess the Output
  🎤 Interview Mode (Coming Soon)
  📚 Practice Grounds (Coming Soon)
  🚪 Exit

↑↓ Navigate • Enter Select • Esc/Ctrl+C Exit
```

### Gameplay
```
EASY  Score: 150    🔥🔥🔥  ❤️ ❤️ 

What will this code output?

console.log(typeof NaN);

Your guess (Enter for new line, Ctrl+S to submit):
number█
```

### Results
```
╔═══════════════════════════════════════╗
║           CORRECT!                    ║
╚═══════════════════════════════════════╝

Nice work! NaN (Not a Number) is actually of 
type 'number' in JavaScript - a quirky but 
important detail!

💡 Fun fact: NaN === NaN returns false!

Press Enter to continue...
```

## ⚙️ Configuration

### Default Mode (No Setup Required)

The app runs in **default mode** with built-in questions:
- ✅ Works immediately after installation
- ✅ No external dependencies required
- ✅ Perfect for getting started!

**Just run and play:**
```bash
npm start
# or if linked globally
interviewquest
```

### Enable AI Features (Optional)

Want AI-powered code generation and evaluation? Use the `--ai` flag:

**Prerequisites:**
1. GitHub CLI installed: `gh --version`
2. Copilot extension: `gh extension install github/gh-copilot`
3. Authenticated: `gh auth login`
4. GitHub Copilot subscription

**Local Development:**
```bash
# Using npm scripts
npm run start:ai
npm run dev:ai

# Or with flag
interviewquest --ai
node dist/bin/interviewquest.js --ai
```

**After Publishing (Production):**
```bash
# AI enabled by default!
npm install -g interviewquest
interviewquest  # AI already enabled

# Disable if needed
interviewquest --no-ai
```

**Available Flags:**
```bash
interviewquest --help        # Show help
interviewquest --version     # Show version
interviewquest --ai          # Enable AI features
interviewquest --copilot     # Same as --ai
interviewquest -c            # Short form
interviewquest --no-ai       # Disable AI (production)
```

**What you get with AI:**
- 🤖 AI-generated code challenges
- 💡 Smarter answer evaluation
- 📝 Detailed feedback and explanations
- 🎯 More varied question types

**Environment Behavior:**
- 🏠 **Local Development:** AI disabled by default (use `--ai` to enable)
- 🚀 **Production:** AI enabled by default (use `--no-ai` to disable)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/interview-quest.git
cd interview-quest

# Install dependencies
npm install

# Start development mode
npm run dev
```

## 🗺️ Roadmap

### Current Features ✅
- [x] Guess the Output mode
- [x] Lives system
- [x] Streak bonuses
- [x] Adaptive difficulty
- [x] Score tracking
- [x] Multi-line input support
- [x] Beautiful terminal UI

### Coming Soon 🚀
- [ ] Interview Mode with AI evaluation
- [ ] Practice Grounds (unlimited practice)
- [ ] More question categories
- [ ] Session persistence
- [ ] Leaderboard system
- [ ] Custom themes
- [ ] Question of the day
- [ ] Multiplayer mode (?)

## 📊 Stats

- **Package Size:** ~70 KB
- **Dependencies:** 3 (minimal!)
- **Lines of Code:** ~5,000+
- **Supported Languages:** JavaScript, TypeScript, DSA, System Design
- **Question Bank:** Growing weekly!

## 🐛 Known Issues

- Terminal must be at least 60x20 for best experience
- Some emojis may not render correctly on older terminals
- Windows CMD has limited color support (use PowerShell or Windows Terminal)

## 💡 Tips for Best Experience

1. **Use a modern terminal:**
   - Windows: Windows Terminal or PowerShell
   - Mac: iTerm2 or default Terminal
   - Linux: gnome-terminal, konsole, or similar

2. **Recommended terminal size:** 80x24 or larger

3. **Enable cursor blinking** for better input visibility

4. **Use dark theme** for optimal color contrast

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- Built with love for the developer community
- Inspired by the need for better interview practice tools
- Thanks to all contributors and testers!

## 📬 Contact & Support

- **GitHub:** https://github.com/anupamthakur-dev/interview-quest
- **Issues:** https://github.com/anupamthakur-dev/interview-quest/issues
- **Author:** Anupam Thakur

---

## 🎯 Quick Start Summary

```bash
# 1. Clone the repo
git clone https://github.com/anupamthakur-dev/interview-quest.git

# 2. Install & build
cd interview-quest
npm install
npm run build

# 3. Start playing!
npm start              # Default mode (no AI)
npm run start:ai       # With AI features

# 4. Optional: Install globally
npm link
interviewquest         # Run from anywhere
interviewquest --ai    # With AI features

# When published via npm (coming soon!)
npm install -g interviewquest
interviewquest         # AI enabled by default
interviewquest --no-ai # Disable AI if needed
```

**Quick Commands:**
- `interviewquest` - Run the game
- `interviewquest --ai` - Enable AI features (local dev)
- `interviewquest --no-ai` - Disable AI (production)
- `interviewquest --help` - Show all options
- `interviewquest --version` - Show version

**Works immediately** with built-in questions! No setup required.  
**Want AI features?** Add `--ai` flag in local dev, or AI is enabled by default in production.

---

**Star the repo ⭐ if you find it helpful!**

Happy coding, and may your interviews be ever in your favor! 🚀

---

*Have questions or suggestions? Drop them in the comments below!* 👇
