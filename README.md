# Buddy Boy - Desktop AI Coding Companion

**Buddy Boy** is an intelligent desktop AI coding assistant designed to help developers solve algorithmic challenges, inspect architecture, and debug code in real time through a sleek, unobtrusive floating HUD.

---

## Features

- 🤖 **Multi-Model Intelligence**: Comprehensive support for top-tier AI models:
  - **OpenAI**: Flagship thinking models (`o3-mini`, `o1`, `o1-mini`, `o1-preview`), multimodal models (`gpt-4o`, `gpt-4o-mini`, `gpt-4.5-preview`, `chatgpt-4o-latest`, `gpt-4-turbo`), and custom model IDs.
  - **Anthropic**: Claude 3.7 Sonnet, Claude 3.5 Sonnet, Claude 3 Opus.
  - **Google Gemini**: Gemini 2.0 Flash, Gemini 1.5 Pro.
- 📸 **Visual Problem & Error Capture**: Snap screenshots of code snippets, terminal traces, or problem descriptions for instant AI interpretation.
- 💡 **Optimal Solution Generation**: Generates clean, production-ready code implementations accompanied by key insights and thorough Time & Space Complexity analysis.
- 🔧 **Real-Time Code Debugging**: Quickly analyze error messages, test case failures, and performance bottlenecks with structured improvement recommendations.
- 🖥️ **Minimalist Floating HUD**: A lightweight desktop overlay that you can move, resize, adjust transparency, or hide with global keyboard shortcuts.
- 🔒 **Privacy First**: Your API keys and data remain completely local on your machine, communicating directly with your chosen AI provider without third-party intermediaries.
- 🌐 **Multi-Language Support**: Out-of-the-box support for Python, JavaScript, TypeScript, C++, Java, C#, Go, Rust, Swift, and more.

---

## Global Hotkeys

Buddy Boy provides frictionless global keyboard shortcuts to operate the companion without interrupting your workflow:

| Action | Shortcut (macOS) | Shortcut (Windows/Linux) |
|---|---|---|
| **Toggle Window Visibility** | `Cmd + B` | `Ctrl + B` |
| **Take Screenshot** | `Cmd + H` | `Ctrl + H` |
| **Delete Last Screenshot** | `Cmd + L` | `Ctrl + L` |
| **Process / Solve** | `Cmd + Enter` | `Ctrl + Enter` |
| **Reset / New Task** | `Cmd + R` | `Ctrl + R` |
| **Move Window** | `Cmd + Arrow Keys` | `Ctrl + Arrow Keys` |
| **Adjust Opacity (Decrease/Increase)** | `Cmd + [` / `Cmd + ]` | `Ctrl + [` / `Ctrl + ]` |
| **Zoom (Out / Reset / In)** | `Cmd + -` / `Cmd + 0` / `Cmd + =` | `Ctrl + -` / `Ctrl + 0` / `Ctrl + =` |
| **Quit Application** | `Cmd + Q` | `Ctrl + Q` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher) or [Bun](https://bun.sh/)
- API key from your preferred provider ([OpenAI](https://platform.openai.com/), [Anthropic](https://console.anthropic.com/), or [Google AI Studio](https://aistudio.google.com/))

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ibttf/buddy-boy.git
   cd buddy-boy
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

3. **Launch in development mode**:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Launch with Desktop Runner**:
   - **Windows**: Run `stealth-run.bat`
   - **macOS / Linux**: Run `./stealth-run.sh`

---

## Configuration

All configuration is managed directly within the Buddy Boy Settings UI and stored locally on your system:

- **API Provider**: Select between OpenAI, Gemini, or Anthropic.
- **Stage Model Selection**:
  - **Problem Extraction (Vision)**: Choose a vision-capable model (e.g. `GPT-4o`, `o1`, `GPT-4.5 Preview`) to extract requirements from screenshots.
  - **Solution Generation**: Select specialized reasoning models (e.g. `o3-mini`, `o1`, `Claude 3.7 Sonnet`) or fast models for code generation.
  - **Debugging (Vision)**: Select an AI model to inspect visual code errors, stack traces, and test results.
- **Custom Model ID**: Enter any custom or fine-tuned model identifier for complete flexibility.
- **Language Preference**: Choose your default coding language.

---

## Tech Stack

- **Framework**: Electron + React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Radix UI Primitives
- **AI Integrations**: OpenAI SDK, Anthropic SDK, Google Generative Language API
- **Screen Capture**: Native desktop capture utilities

---

## Building Installers

To package Buddy Boy for your platform:

- **macOS (DMG / Zip)**:
  ```bash
  npm run package-mac
  ```
- **Windows (NSIS Installer)**:
  ```bash
  npm run package-win
  ```

Packaged installers will be generated in the `release/` directory.

---

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE) for details.
