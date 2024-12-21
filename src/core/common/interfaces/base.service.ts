import { Observable } from 'rxjs';

export interface IBaseService<T> {
  // 基础CRUD操作
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;

  // 缓存操作
  getCached(key: string): Promise<T | null>;
  setCached(key: string, value: T, ttl?: number): Promise<void>;

  // 监控和日志
  getMetrics(): Observable<any>;
  logActivity(activity: string, data?: any): void;

  // 错误处理
  handleError(error: Error): void;
  validateData(data: Partial<T>): Promise<boolean>;

  // 离线支持
  syncOfflineData(): Promise<void>;
  isOfflineAvailable(): boolean;

  // 性能优化
  optimizePerformance(): Promise<void>;
  getPerformanceMetrics(): Observable<any>;
}
