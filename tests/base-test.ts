import { test as base, expect, type Page, type TestInfo } from '@playwright/test';
import { takeScreenshotOnFailure } from '../utils/screenshotUtils';

const test = base.extend<{}>({});

test.afterEach(async ({ page }, testInfo: TestInfo) => {
  await takeScreenshotOnFailure(page, testInfo);
});

export { test, expect };
