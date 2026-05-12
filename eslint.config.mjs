import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Stylistic only — typographic apostrophes look better but we use plain ' for editor friendliness.
      "react/no-unescaped-entities": "off",
      // The rule fires on legitimate hydration patterns (loading from localStorage on mount,
      // fetching weather when profile location changes). Quietened intentionally.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
