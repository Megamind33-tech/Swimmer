<div align="center">
<img width="1200" height="475" alt="Swimmer Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Swimmer - 3D Swimming Simulator

A realistic 3D swimming simulation game built with Babylon.js and React.

## Features

- 🏊 Realistic swimming physics and mechanics
- 🎮 Multiple game modes (Career, Training, Racing)
- 🏟️ Detailed 3D swimming arena with realistic water effects
- 📱 Touch controls for mobile support
- 🎥 Replay system for races
- 🏆 Rival system and career progression

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript type checking |
| `npm test` | Run E2E tests |

## E2E Testing (Playwright)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browser binaries (first run only):
   ```bash
   npx playwright install chromium
   ```

3. Run all critical-flow tests:
   ```bash
   npm test
   ```

Useful variants:
- Headed: `npm run test:e2e:headed`
- Debug: `npm run test:e2e:debug`

## Tech Stack

- **Frontend:** React 19, TypeScript
- **3D Engine:** Babylon.js
- **Styling:** Tailwind CSS 4
- **Animation:** Motion
- **Build Tool:** Vite
- **Testing:** Playwright

## License

MIT
