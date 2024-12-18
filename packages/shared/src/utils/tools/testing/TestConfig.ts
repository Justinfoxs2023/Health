import * as jest from 'jest';
import { Config } from '@jest/types';

export class TestConfig {
  static readonly config: Config.InitialOptions = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: ['./jest.setup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|react-native-vector-icons)/)',
    ],
    collectCoverage: true,
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  };

  static async runTests(options: jest.Config = {}) {
    const mergedConfig = {
      ...this.config,
      ...options,
    };

    return jest.runCLI(mergedConfig as any, [process.cwd()]);
  }

  static async watchTests() {
    return this.runTests({ watch: true });
  }

  static async generateCoverage() {
    return this.runTests({
      collectCoverage: true,
      coverageDirectory: 'coverage',
    });
  }
}
