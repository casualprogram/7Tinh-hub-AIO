// File: jest.config.js (ESM)
export default {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testMatch: ['**/test/**/*.test.js'], // Add this line to include your test directory
  };