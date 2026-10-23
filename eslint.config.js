import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["demo/**", "node_modules/**"] },
  js.configs.recommended,
  { files: ["js/**/*.js"], languageOptions: { globals: globals.browser } },
  {
    files: ["scripts/**/*.js", "tests/**/*.js"],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
];
