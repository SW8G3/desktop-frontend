import globals from 'globals';
import pluginJs from '@eslint/js';
import jest from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import cypress from 'eslint-plugin-cypress';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-console': 'warn',
      'no-extra-semi': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-empty': 'error',
    },
  },
  {
    files: ['__test__/*', '**/*.test.js'],
    plugins: { jest },
    rules: {
      ...jest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      }
    }
  },
  {
    files: ['**/cypress/**/*', '**/*.cy.js'], // Cypress-specific files
    plugins: { cypress },
    languageOptions: {
      globals: {
        cy: 'readonly', // Adding Cypress global objects
        Cypress: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
];
