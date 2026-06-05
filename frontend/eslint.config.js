import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 19 strict rule that flags legitimate patterns we use:
      //   - intentional animation effects (Sheet open/close transitions)
      //   - data-fetching effects (useStudents/useSchoolYear/useClassrooms)
      // Downgraded to a warning so it shows in editors but doesn't fail CI.
      'react-hooks/set-state-in-effect': 'warn',
      // Vite HMR hint, not a correctness rule. We export utility functions
      // alongside components in a few files; that's fine for our use case.
      'react-refresh/only-export-components': 'off',
      // Allow unused args that start with _ (callback APIs); otherwise flag.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
])
