# NDVI Test Suite - Project Description

This is a comprehensive TypeScript-based Playwright test suite for the mapnj2 NDVI analysis application running on http://localhost:3000.

## Test Structure

All test files are organized in `tests/e2e/` directory with feature-prefixed naming:

- **PointPoints.spec.ts** - Point Analysis (Points Mode)
- **PointMonths.spec.ts** - Point Analysis (Months Mode)
- **AreaAreas.spec.ts** - Area Analysis (Areas Mode)
- **AreaMonths.spec.ts** - Area Analysis (Months Mode)
- **MapInteractions.spec.ts** - Map functionality
- **ChartInteractions.spec.ts** - Chart functionality
- **CloudTolerance.spec.ts** - Cloud tolerance settings
- **BasemapSwitching.spec.ts** - Basemap selection
- **ShareFunctionality.spec.ts** - Share feature
- **ModeSwitching.spec.ts** - Mode transitions
- **AdminLogin.spec.ts** - Admin authentication
- **AdminDashboard.spec.ts** - Admin dashboard features
- **APIEndpoints.spec.ts** - API endpoint testing
- **EdgeCases.spec.ts** - Error handling and edge cases

## Helper Modules

Located in `tests/helpers/`:
- **map-helpers.ts** - Map interaction utilities
- **chart-helpers.ts** - Chart interaction utilities
- **api-helpers.ts** - API testing utilities

## Test Fixtures

Located in `tests/fixtures/`:
- **test-fixtures.ts** - Common test fixtures and page objects

## Running Tests

```bash
npm test              # Run all tests
npm run test:ui      # Run with UI mode
npm run test:headed  # Run with visible browser
npm run test:debug   # Run in debug mode
```

## Test Coverage

The test suite covers:
- Point analysis in both Points and Months modes
- Area analysis in both Areas and Months modes
- Map interactions (pan, zoom, click)
- Chart interactions (navigation, Y-axis toggle)
- Cloud tolerance settings
- Basemap switching
- Share functionality
- Mode switching
- Admin dashboard and authentication
- API endpoints
- Error handling and edge cases

