module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    indent: [2, 4],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@mui/*/*/*'],
      },
    ],
    'semi': ['error', 'always', { 'omitLastInOneLineBlock': false }],
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],
  },
};
