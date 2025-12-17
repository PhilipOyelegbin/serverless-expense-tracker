import js from "@eslint/js";
import tseslint from "typescript-eslint";
import functional from "eslint-plugin-functional";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Apply functional programming constraints globally
    plugins: {
      functional,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Direct enforcement of the Core Principles [cite: 19]

      // 1. Immutability by Default [cite: 28]
      "functional/no-let": "error", // Requirement: Use const [cite: 30]
      "functional/immutable-data": "error", // Requirement: Treat data as immutable [cite: 29]

      // 2. Functional Approach [cite: 24]
      "functional/no-classes": "error", // Requirement: Prefer functional over OOP [cite: 25]
      "functional/no-this-expressions": "error", // Requirement: Use OOP only when required [cite: 26]
      "functional/prefer-immutable-types": "error", // Requirement: Favor pure functions [cite: 27]

      // 3. Minimalistic and Elegant [cite: 20]
      complexity: ["error", { max: 5 }], // Requirement: Avoid over-engineering [cite: 23]

      // 4. DRY (Don't Repeat Yourself) [cite: 37]
      "@typescript-eslint/no-unused-vars": "error", // Requirement: Avoid duplication [cite: 39]
    },
  },
  {
    ignores: ["dist/", "cdk.out/", "node_modules/"],
  }
);
