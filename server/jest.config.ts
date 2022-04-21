import 'jest';
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: "@shelf/jest-mongodb",
  testMatch: [
    "**/__test__/**/*.test.ts?(x)"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.ts'
  ],
  forceExit: true,
};
export default config;
