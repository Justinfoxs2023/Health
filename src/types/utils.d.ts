declare namespace Utils {
  // 通用工具类型
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };

  // 分页相关类型
  interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }

  interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }

  // 错误处理类型
  interface ErrorResponse {
    code: string;
    message: string;
    details?: Record<string, any>;
  }

  // 缓存配置类型
  interface CacheConfig {
    ttl: number;
    maxSize: number;
    writePattern: 'write-through' | 'write-behind';
  }

  // 服务健康检查类型
  interface HealthCheck {
    status: 'healthy' | 'unhealthy' | 'degraded';
    details: Record<string, {
      status: string;
      message?: string;
      lastChecked: Date;
    }>;
  }

  // 日志类型
  interface LogEntry {
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    timestamp: Date;
    context?: Record<string, any>;
    trace?: string;
  }
}
