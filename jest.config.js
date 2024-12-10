module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/ai-services'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'ai-services/**/*.(t|j)s',
    '!ai-services/**/*.d.ts',
    '!ai-services/**/*.module.ts',
    '!ai-services/**/index.ts',
  ],
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '^@ai-services/(.*)$': '<rootDir>/ai-services/$1',
    '^@shared/(.*)$': '<rootDir>/ai-services/shared/$1',
    '^@health-core/(.*)$': '<rootDir>/ai-services/health-core/$1',
    '^@types/(.*)$': '<rootDir>/ai-services/shared/types/$1',
    '^@utils/(.*)$': '<rootDir>/ai-services/shared/utils/$1',
    '^@models/(.*)$': '<rootDir>/ai-services/shared/models/$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testTimeout: 30000,
}; 