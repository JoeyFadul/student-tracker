import { defineConfig } from '@playwright/test'

// E2E smoke suite. Runs against `vite dev` with fake env config; the API is
// mocked at the network layer inside each spec (page.route), so no backend
// or Cognito access is needed. Vite gives process.env precedence over .env
// files, so these values win even on machines with a real .env.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5199',
  },
  webServer: {
    command: 'npx vite --port 5199 --strictPort',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_API_URL: 'https://api.e2e.test',
      VITE_USER_POOL_ID: 'us-east-1_e2etest',
      VITE_USER_POOL_CLIENT_ID: 'e2e-client-id',
    },
  },
})
