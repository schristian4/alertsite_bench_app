import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './__e2e__',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
})
