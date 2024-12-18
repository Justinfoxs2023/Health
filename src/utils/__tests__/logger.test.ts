import { Logger } from '../logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger('TestContext');
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create logger with context', () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it('log info messages', () => {
    const message = 'Test info message';
    logger.info(message);
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it('log error messages', () => {
    const message = 'Test error message';
    const error = new Error('Test error');
    logger.error(message, error);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('log warning messages', () => {
    const message = 'Test warning message';
    logger.warn(message);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('log debug messages', () => {
    const message = 'Test debug message';
    logger.debug(message);
    expect(consoleDebugSpy).toHaveBeenCalled();
  });
});
