// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeToFile: true, // Add this
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule globally
    },
  },
  {
    files: ["app/service/color-process/page.tsx"], // Apply only to this file
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule only for this file
    },
  },
];

export default eslintConfig;
