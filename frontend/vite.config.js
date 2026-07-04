import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // amazon-cognito-identity-js's bundled `buffer` polyfill references Node's
  // `global`, which exists in production builds (Rollup's CJS handling shims
  // it) but not under the dev server — without this, `vite dev` white-screens
  // at boot. Standard fix for this library on Vite.
  define: { global: 'globalThis' },
})
