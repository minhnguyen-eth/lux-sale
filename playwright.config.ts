import { defineConfig, devices } from '@playwright/test';

const isHeadless = process.env.HEADLESS !== 'false';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 120000,

  reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { open: 'never' }]
  ],

  use: {

    // headless: false, // true run in headless mode. false run with browser window opened.
    // viewport: null,
    headless: isHeadless, 
    viewport: isHeadless ? { width: 1920, height: 1080 } : null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    // video: 'on',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 45000,
  },

  projects: [
    {
      name: 'Chromium',
    },
    // {
    //   name: 'Edge',
    //   use: {
    //     channel: 'msedge',
    //     ...devices['Desktop Chrome'],
    //   },
    // },
    // {
    //   name: 'Firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],
});
