export class TransformerUtils {
  // 数据格式转换
  static transformData<T, R>(
    data: T | T[],
    transformer: (item: T) => R
  ): R | R[] {
    if (Array.isArray(data)) {
      return data.map(transformer);
    }
    return transformer(data);
  }

  // 数据过滤
  static filterData<T>(
    data: T[],
    predicate: (item: T) => boolean
  ): T[] {
    return data.filter(predicate);
  }

  // 数据分组
  static groupBy<T>(
    data: T[],
    key: keyof T
  ): Record<string, T[]> {
    return data.reduce((groups, item) => {
      const groupKey = String(item[key]);
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  // 数据聚合
  static aggregate<T>(
    data: T[],
    key: keyof T,
    aggregator: (values: any[]) => any
  ): Record<string, any> {
    const groups = this.groupBy(data, key);
    return Object.entries(groups).reduce((result, [groupKey, items]) => {
      result[groupKey] = aggregator(items);
      return result;
    }, {} as Record<string, any>);
  }
} 