import { fixupConfigRules } from "@eslint/compat";
import reactRefresh from "eslint-plugin-react-refresh";
import fsd from "@eryshev/eslint-plugin-fsd";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/dist", "**/.eslintrc.cjs"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
)), {
    plugins: {
        "react-refresh": reactRefresh,
        "@eryshev/fsd": fsd,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
    },

    rules: {
        "react-refresh/only-export-components": ["warn", {
            allowConstantExport: true,
        }],

        "no-restricted-imports": ["error", {
            patterns: ["@mui/*/*/*"],
        }],

        "@eryshev/fsd/path-checker": ["error", {
            alias: "@",
        }],

        "@eryshev/fsd/public-api-imports": ["error", {
            alias: "@",
            testFilesPatterns: ["**/*.test.*", "**/*.story.*", "**/StoreDecorator.tsx"],
        }],

        "@eryshev/fsd/layer-imports": ["error", {
            alias: "@",
            ignoreImportPatterns: ["**/StoreProvider", "**/testing"],
        }],
        "@typescript-eslint/no-unused-expressions": "off",
    },
}];