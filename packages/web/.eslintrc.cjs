module.exports = {
  extends: [
      'eslint:recommended',
      'plugin:jsdoc/recommended',
      "plugin:react/recommended"
  ],
  root: true,
  plugins: [
      "jsdoc",
      "react"
  ],
  overrides: [
    {
      extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
      ],
      files: ["src/**/*.ts", "src/**/*.spec.ts"],
      plugins: [
          "@typescript-eslint",
      ],
      parser: '@typescript-eslint/parser',
    },
  ],
  ignorePatterns: ["dist", "coverage", "jest.config.js"],
  rules: {
      'jsdoc/require-jsdoc': [
          'error',
      ],
      'no-unused-vars': [1]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};