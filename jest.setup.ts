import '@testing-library/jest-dom';

// 设置测试超时时间
jest.setTimeout(30000);

// 全局清理
afterEach(() => {
  jest.clearAllMocks();
});

// 全局错误处理
console.error('Error in jest.setup.ts:', 'unhandledRejection', error => {
  console.error('Error in jest.setup.ts:', 'Unhandled Promise Rejection:', error);
});
