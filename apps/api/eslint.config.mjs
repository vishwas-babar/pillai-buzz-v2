import baseConfig from "../../packages/config/eslint.base.mjs"

export default [
   ...baseConfig,
   {
      ignores: ["eslint.config.mjs", "dist/", "node_modules/"],
   },
]
