module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:react-hooks/recommended",
    "@remix-run/eslint-config",
  ],
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
  overrides: [
    {
      files: ["*.test.ts", "*.spec.ts", "**/test-utils/**"],
      rules: {
        "@typescript-eslint/no-explicit-any": [0],
        "@typescript-eslint/no-non-null-assertion": [0],
      },
    },
  ],
}
