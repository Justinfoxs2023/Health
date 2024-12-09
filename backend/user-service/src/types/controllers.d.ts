declare module '../controllers/*' {
  // 管理员服务
  export interface AdminService {
    updateUserRoles(userId: string, roles: string[]): Promise<void>;
    updateSystemConfig(config: any): Promise<void>;
  }

  // 分析服务
  export interface AnalyticsService {
    getMetrics(timeRange: string): Promise<any>;
    generateReport(options: any): Promise<any>;
  }

  // 内容服务
  export interface ContentService {
    reviewContent(data: any): Promise<void>;
    publishContent(data: any): Promise<void>;
  }

  // 图标服务
  export interface IconService {
    uploadIcon(file: any): Promise<string>;
    getIconList(): Promise<any[]>;
  }
} 