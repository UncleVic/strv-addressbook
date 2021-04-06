module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json'
    }
  },
  preset: 'ts-jest',
  verbose: true,
  cacheDirectory: './buildcache',
  testEnvironment: 'node',
  testTimeout: 60000,
  testRegex: './tests/.*\.(test|spec)\.(ts)$',
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  setupFiles: [
    'dotenv/config',
  ]
};
