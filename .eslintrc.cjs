module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@eryshev/fsd"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "no-restricted-imports": [
      "error",
      {
        patterns: ["@mui/*/*/*"]
      }
    ],
    "@eryshev/fsd/path-checker": ["error", { alias: "@" }],
    "@eryshev/fsd/public-api-imports": ["error", { alias: "@" }],
  }
};
