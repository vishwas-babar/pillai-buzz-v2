import baseConfig from "../../packages/config/eslint.base.mjs"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"

export default [
  ...baseConfig,
  reactPlugin.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
    settings: {
      react: { version: "detect" },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
      },
    },
  },
  {
    ignores: [".next/", "out/", "build/", "node_modules/", "dist/", "eslint.config.mjs"],
  },
]
