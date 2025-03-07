// jest.config.js
export default {
    testEnvironment: 'node', // Node.js environment
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1', // Handle .js imports
    },
    testMatch: ['**/test/**/*.test.js'], // Match your test files
    transform: {}, // No transforms needed for native ESM
    setupFiles: ['<rootDir>/jest.setup.js'], // Load .env
  };