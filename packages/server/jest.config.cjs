/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '@atomic-todo/test-reporter/node',
  testEnvironmentOptions: {
    resultsDir: './test-results'
  },
  testPathIgnorePatterns: ['dist'],
  globalSetup: './global-setup.cjs',
};