export class ValidatorUtils {
  // 类型检查
  static isType(value: any, type: string): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  }

  // 必填字段检查
  static validateRequired(data: any, fields: string[]): string[] {
    return fields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });
  }

  // 数值范围检查
  static validateRange(
    value: number,
    min?: number,
    max?: number
  ): boolean {
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  }

  // 字符串格式检查
  static validateFormat(
    value: string,
    format: RegExp
  ): boolean {
    return format.test(value);
  }

  // 自定义验证规则
  static validateCustom(
    value: any,
    validator: (value: any) => boolean
  ): boolean {
    return validator(value);
  }
} 