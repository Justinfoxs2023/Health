/**
 * @fileoverview TS 文件 error-monitor.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 错误监控工具
 */
export class ErrorMonitor {
  /**
   * 记录错误信息
   */
  static logError(error: Error, context?: string) {
    console.error('Error in error-monitor.ts:', `[${context || '未知位置'}] 错误:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 全局错误处理
   */
  static initGlobalErrorHandler() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.logError(error || new Error(message as string), '全局错误');
      return false;
    };

    window.onunhandledrejection = event => {
      this.logError(event.reason, '未处理的Promise错误');
    };
  }
}
