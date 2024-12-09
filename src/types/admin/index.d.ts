// 管理端基础类型
export interface AdminConfig {
  roles: AdminRole[];
  permissions: Permission[];
  features: Feature[];
  settings: AdminSettings;
}

// 管理角色
export interface AdminRole {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 权限定义
export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'read' | 'write' | 'admin';
  resource: string;
}

// 功能定义
export interface Feature {
  id: string;
  code: string;
  name: string;
  status: 'enabled' | 'disabled';
  config: any;
}

// 管理设置
export interface AdminSettings {
  security: SecuritySettings;
  notification: NotificationSettings;
  audit: AuditSettings;
  ui: UISettings;
} 