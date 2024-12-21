/**
 * @fileoverview TS 文件 serializer.utils.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class SerializerUtils {
  // 序列化数据
  static serialize(data: any): string {
    try {
      return JSON.stringify(data, (key, value) => {
        if (value instanceof Map) {
          return {
            dataType: 'Map',
            value: Array.from(value.entries()),
          };
        }
        if (value instanceof Set) {
          return {
            dataType: 'Set',
            value: Array.from(value),
          };
        }
        if (value instanceof Date) {
          return {
            dataType: 'Date',
            value: value.toISOString(),
          };
        }
        if (value instanceof RegExp) {
          return {
            dataType: 'RegExp',
            source: value.source,
            flags: value.flags,
          };
        }
        return value;
      });
    } catch (error) {
      throw new Error(`序列化失败: ${error.message}`);
    }
  }

  // 反序列化数据
  static deserialize(json: string): any {
    try {
      return JSON.parse(json, (key, value) => {
        if (value && typeof value === 'object' && value.dataType) {
          switch (value.dataType) {
            case 'Map':
              return new Map(value.value);
            case 'Set':
              return new Set(value.value);
            case 'Date':
              return new Date(value.value);
            case 'RegExp':
              return new RegExp(value.source, value.flags);
            default:
              return value;
          }
        }
        return value;
      });
    } catch (error) {
      throw new Error(`反序列化失败: ${error.message}`);
    }
  }
}
