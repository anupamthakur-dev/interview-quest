# InterviewQuest

A gamified interview simulator for developers, built entirely for the terminal.

## 🎮 About

InterviewQuest is a production-quality CLI application that helps developers practice technical interview questions in a gamified, terminal-based environment. Practice coding interviews with AI-powered evaluation and instant feedback!

## 🚀 Quick Start

### Install Globally via npm

```bash
npm install -g interviewquest
```

### Run the Game

```bash
interviewquest
```

That's it! Just type `interviewquest` anywhere in your terminal to start practicing.

## 📋 Prerequisites

- Node.js >= 18
- npm or yarn

## 🔧 Local Development

If you want to develop or modify the project:

```bash
# Clone the repository
git clone https://github.com/yourusername/interviewquest.git
cd interviewquest

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
npm start
```

## 💻 Usage

After global installation, simply run:

```bash
interviewquest
```

### Available Game Modes

1. **Guess the Output** 🎯
   - AI-generated code snippets
   - Lives system (3 hearts)
   - Adaptive difficulty
   - Streak bonuses

2. **Interview Mode** 🎤 (Coming Soon)
   - Realistic interview simulation
   - AI evaluation with GitHub Copilot
   - Timed challenges
   - Detailed feedback

3. **Practice Grounds** 📚 (Coming Soon)
   - Unlimited practice
   - No time pressure
   - Learn at your own pace

## ⚙️ Configuration (Optional)

### Enable GitHub Copilot AI Features

For AI-powered evaluation and code generation:

**Linux/Mac:**
```bash
export USE_COPILOT=true
npm start
```

**Windows PowerShell:**
```powershell
$env:USE_COPILOT="true"
interviewquest
```

**Requirements for AI features:**
- GitHub CLI: `gh --version`
- Copilot extension: `gh extension install github/gh-copilot`
- Authentication: `gh auth login`

## ✨ Features

- 🎯 **Interactive CLI Game** - Beautiful terminal UI with animations
- 🧠 **Smart Difficulty** - Adapts to your skill level
- 💝 **Lives System** - 3 hearts, lose one on wrong answers
- 🔥 **Streak Bonuses** - Get 3 in a row to level up
- 📊 **Score Tracking** - Track your progress and accuracy
- 🎨 **Styled Interface** - Colorful, centered terminal design
- ⚡ **No External Dependencies** - Minimal, fast, reliable
- 🤖 **AI Integration** - Optional GitHub Copilot support

```
bin/
  interviewquest.ts         # Entry point

src/
  app/
    index.ts               # Main app initialization
    config.ts              # App configuration (coming soon)
    environment.ts         # Environment settings (coming soon)

  ui/
    screen.ts              # Terminal utilities and cursor control
    banner.ts              # Centered ASCII banner rendering
    terminal.ts            # Terminal wrapper with centering and resize handling
    input.ts               # Native readline-based input handling
    menu-native.ts         # Menu system using native inputs
    timer.ts               # Timer component

  game/
    engine.ts              # Game engine (coming soon)
    state.ts               # State management (coming soon)
    modes.ts               # Game modes (coming soon)
    round.ts               # Round logic (coming soon)
    scoring.ts             # Scoring system (coming soon)
    difficulty.ts          # Difficulty adaptation (coming soon)

  questions/
    index.ts               # Question management (coming soon)
    categories.ts          # Question categories (coming soon)
    loader.ts              # Question loader (coming soon)
    bank/                  # Question banks (coming soon)

  evaluation/
    evaluator.ts           # Answer evaluation (coming soon)
    rubric.ts              # Evaluation rubric (coming soon)
    feedback.ts            # Feedback generation (coming soon)
    copilot.ts             # GitHub Copilot integration (coming soon)

  utils/
    constants.ts           # App constants
    delay.ts               # Delay utilities (coming soon)
    format.ts              # Formatting helpers (coming soon)
    logger.ts              # Logging utilities (coming soon)

  types/
    game.ts                # Game-related types
    question.ts            # Question types
    evaluation.ts          # Evaluation types (coming soon)
    user.ts                # User types (coming soon)
```

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **UI**: Native readline + custom terminal wrapper (centered, responsive)
- **Architecture**: Modular, scalable

## ✨ Terminal Features

- **Centered Content**: All content is horizontally centered in the terminal
- **Responsive Design**: Automatically adjusts to terminal resize events
- **Minimum Size Check**: Displays a warning if terminal is too small (min: 60x20)
- **Native Input**: Uses Node.js readline instead of external dependencies
- **Clean Interface**: No dependencies on inquirer or other prompt libraries

## 📜 Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run the application
- `npm run dev` - Quick development run

## 🎯 Current Status

✅ **Fully Functional** - Quick Quest and Interview Mode are complete!

The application currently:
- Shows a clean ASCII banner on launch
- Displays an interactive menu with all game modes
- Handles user navigation and exit gracefully
- Compiles successfully with TypeScript
- **Quick Quest Mode**: 5-question challenges with basic evaluation
  - 21 questions across 4 categories
  - Concept-based evaluation
  - XP system with levels
  - Progress tracking
- **Interview Mode**: 10-question AI-powered interviews ✨ NEW!
  - GitHub Copilot AI evaluation
  - AI-generated hints (with score penalty)
  - Detailed AI feedback and suggestions
  - Graceful fallback to basic evaluation
  - Interview-realistic pacing

**Question Bank:**
- JavaScript: 6 questions (easy to hard)
- TypeScript: 5 questions (easy to hard)
- Data Structures & Algorithms: 6 questions (easy to hard)
- System Design: 4 questions (medium to hard)

**Requirements for Interview Mode:**
- GitHub CLI: `gh --version`
- Copilot extension: `gh extension install github/gh-copilot`
- Authentication: `gh auth login`

**Coming Soon**:
- Practice Grounds with unlimited practice and no pressure
- UI enhancements with colors (chalk)
- Session persistence and statistics
- More question categories

## 🤝 Contributing

This is a production-quality CLI application built with strict architectural guidelines. Please ensure:
- Strong typing everywhere
- Clean, modular code
- No unnecessary abstractions
- Clear comments only where needed

## 📄 License

MIT

---

Built with ❤️ for developers preparing for technical interviews
