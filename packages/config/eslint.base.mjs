import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"
import unusedImports from "eslint-plugin-unused-imports"
import importPlugin from "eslint-plugin-import"
import globals from "globals"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      "unused-imports": unusedImports,
      "workspace-import": importPlugin,
    },
    rules: {
      // remove unused imports automatically
      "unused-imports/no-unused-imports": "error",

      // warn unused variables
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // cleaner imports
      "workspace-import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
        },
      ],

      // allow explicit any during development
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  eslintConfigPrettier,
)
