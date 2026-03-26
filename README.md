<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/337815ea-4125-4c5d-8475-e5f2425d1178

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Automated release-flow verification (Playwright E2E)

This repo includes executable browser tests for critical ship paths.

1. Install dependencies (and Playwright package):
   `npm install`
2. Install Playwright browser binaries (first run only):
   `npx playwright install chromium`
3. Run all critical-flow tests:
   `npm test`

Useful variants:
- Headed: `npm run test:e2e:headed`
- Debug: `npm run test:e2e:debug`
