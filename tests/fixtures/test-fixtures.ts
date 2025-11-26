import { test as base } from '@playwright/test';
import { MapHelpers } from '../helpers/map-helpers';
import { ChartHelpers } from '../helpers/chart-helpers';
import { APIHelpers } from '../helpers/api-helpers';

type TestFixtures = {
  mapHelpers: MapHelpers;
  chartHelpers: ChartHelpers;
  apiHelpers: APIHelpers;
};

export const test = base.extend<TestFixtures>({
  mapHelpers: async ({ page }, use) => {
    await use(new MapHelpers(page));
  },
  chartHelpers: async ({ page }, use) => {
    await use(new ChartHelpers(page));
  },
  apiHelpers: async ({ page, request }, use) => {
    await use(new APIHelpers(page, request));
  },
});

export { expect } from '@playwright/test';

