/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testTimeout: 60000,
  moduleNameMapper: {
    '^config$': '<rootDir>/src/config.ts',
    '^@app/(.+)$': '<rootDir>/src/app/$1',
    '^@client/(.+)$': '<rootDir>/src/client/$1',
    '^@config/(.+)$': '<rootDir>/src/config/$1',
    '^@core/(.+)$': '<rootDir>/src/core/$1',
    '^@domains/(.+)$': '<rootDir>/src/app/domains/$1',
    '^@resources/(.+)$': '<rootDir>/src/resources/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {}],
  },
}
