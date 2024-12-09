export class TypeChecker {
  static validateObject<T>(obj: any, schema: Record<keyof T, any>): boolean {
    if (!obj || typeof obj !== 'object') return false;
    
    for (const key in schema) {
      if (!obj.hasOwnProperty(key)) return false;
      if (typeof obj[key] !== typeof schema[key]) return false;
    }
    
    return true;
  }

  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isValidNumber(num: any): boolean {
    return typeof num === 'number' && !isNaN(num);
  }
} 