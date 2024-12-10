import { AxiosError } from 'axios';
import { ErrorService, ErrorType, ErrorHandler, ConsoleErrorHandler } from '../index';

describe('ErrorService', () => {
  let errorService: ErrorService;
  let mockHandler: ErrorHandler;

  beforeEach(() => {
    errorService = ErrorService.getInstance();
    mockHandler = {
      handle: jest.fn()
    };
    // 清除所有处理器
    // @ts-ignore 访问私有属性
    errorService.handlers = [];
  });

  it('应该是单例', () => {
    const instance1 = ErrorService.getInstance();
    const instance2 = ErrorService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('应该能添加和移除错误处理器', () => {
    errorService.addHandler(mockHandler);
    // @ts-ignore 访问私有属性
    expect(errorService.handlers).toContain(mockHandler);

    errorService.removeHandler(mockHandler);
    // @ts-ignore 访问私有属性
    expect(errorService.handlers).not.toContain(mockHandler);
  });

  it('应该正确处理网络错误', () => {
    errorService.addHandler(mockHandler);
    const axiosError = new AxiosError(
      '网络错误',
      'ECONNABORTED'
    );

    errorService.handleError(axiosError);

    expect(mockHandler.handle).toHaveBeenCalledWith({
      type: ErrorType.NETWORK,
      message: '网络连接失败，请检查网络设置',
      originalError: axiosError
    });
  });

  it('应该正确处理HTTP错误', () => {
    errorService.addHandler(mockHandler);
    const response = {
      status: 401,
      data: { message: '未授权访问' }
    };
    const axiosError = new AxiosError(
      '未授权',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      response as any
    );

    errorService.handleError(axiosError);

    expect(mockHandler.handle).toHaveBeenCalledWith({
      type: ErrorType.AUTH,
      message: '未授权，请重新登录',
      code: 401,
      originalError: axiosError
    });
  });

  it('应该正确处理普通Error对象', () => {
    errorService.addHandler(mockHandler);
    const error = new Error('测试错误');

    errorService.handleError(error);

    expect(mockHandler.handle).toHaveBeenCalledWith({
      type: ErrorType.UNKNOWN,
      message: '测试错误',
      originalError: error
    });
  });

  it('应该正确处理非Error对象', () => {
    errorService.addHandler(mockHandler);
    const error = '字符串错误';

    errorService.handleError(error);

    expect(mockHandler.handle).toHaveBeenCalledWith({
      type: ErrorType.UNKNOWN,
      message: '字符串错误',
      originalError: error
    });
  });
});

describe('ConsoleErrorHandler', () => {
  let consoleErrorSpy: jest.SpyInstance;
  const handler = new ConsoleErrorHandler();

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('应该正确记录错误信息', () => {
    const errorInfo = {
      type: ErrorType.BUSINESS,
      message: '业务错误',
      code: 'BIZ_001'
    };

    handler.handle(errorInfo);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[BUSINESS] 业务错误 (BIZ_001)'
    );
  });

  it('应该在没有错误码时正确记录错误信息', () => {
    const errorInfo = {
      type: ErrorType.NETWORK,
      message: '网络错误'
    };

    handler.handle(errorInfo);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[NETWORK] 网络错误'
    );
  });
}); 