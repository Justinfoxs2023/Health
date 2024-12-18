/**
 * @fileoverview TS 文件 service-tester.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class ServiceTester {
  static async testMethod(method: Function, params: any[], expectedType: any): Promise<boolean> {
    try {
      const result = await method(...params);
      return this.validateResult(result, expectedType);
    } catch (error) {
      console.error('Error in service-tester.ts:', 'Method test failed:', error);
      return false;
    }
  }

  private static validateResult(result: any, expectedType: any): boolean {
    if (result === null || result === undefined) {
      return expectedType === null || expectedType === undefined;
    }

    if (Array.isArray(expectedType)) {
      return (
        Array.isArray(result) && result.every(item => this.validateResult(item, expectedType[0]))
      );
    }

    return result instanceof expectedType;
  }
}
