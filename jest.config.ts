import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/**/*.test.ts', '**/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.database-pg/','/.database-pg-test/', '/migrations/'],
  clearMocks: true,
};

export default config;
