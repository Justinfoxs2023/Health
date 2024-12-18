/**
 * @fileoverview TS 文件 jest.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
