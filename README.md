# NDVI Test Suite

Playwright test suite for mapnj2 NDVI analysis application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Ensure mapnj2 is running on http://localhost:3000

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in UI mode:
```bash
npm run test:ui
```

Run tests in headed mode (see browser):
```bash
npm run test:headed
```

Run tests in debug mode:
```bash
npm run test:debug
```

## Current Tests

### Share Button Test
Tests the Share button functionality:
- Verifies Share link is visible on landing page
- Clicks Share link and verifies popup opens
- Verifies popup contains textbox with share URL
- Verifies URL contains token parameter
- Verifies copy to clipboard functionality
- Verifies share URL returns HTTP 200

