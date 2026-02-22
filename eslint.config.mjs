import baseConfig from "./packages/config/eslint.base.mjs"

export default [
   ...baseConfig,
   {
      ignores: [
         "**/node_modules/",
         "**/.next/",
         "**/.turbo/",
         "**/dist/",
         "**/build/",
         "**/out/",
      ],
   },
]
