import { Logger } from '../logger';

export const createMockLogger = () => {
  const mockLogger = new Logger('TestLogger');
  jest.spyOn(mockLogger, 'info').mockImplementation();
  jest.spyOn(mockLogger, 'error').mockImplementation();
  jest.spyOn(mockLogger, 'warn').mockImplementation();
  jest.spyOn(mockLogger, 'debug').mockImplementation();
  return mockLogger;
};

export const clearMocks = () => {
  jest.clearAllMocks();
  jest.resetModules();
};
