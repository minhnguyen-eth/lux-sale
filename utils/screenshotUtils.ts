import { Page, TestInfo } from '@playwright/test';
import { allure } from 'allure-playwright';
import fs from 'fs';
import path from 'path';

export async function takeScreenshotOnFailure(page: Page, testInfo: TestInfo): Promise<void> {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshotsDir = path.join(__dirname, '..', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    const safeTitle = testInfo.title.replace(/[^a-z0-9\-]/gi, '_').toLowerCase();
    const filePath = path.join(screenshotsDir, `${safeTitle}.png`);

    const buffer = await page.screenshot({ path: filePath, fullPage: true });
    console.log(`📸 Screenshot saved: ${filePath}`);

    // Đính kèm ảnh vào Allure report
    allure.attachment('Failure Screenshot', buffer, 'image/png');
  }
}
