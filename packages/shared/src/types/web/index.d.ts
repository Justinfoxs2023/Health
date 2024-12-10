// Web端用户类型
export interface WebUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  organization?: Organization;
  permissions: Permission[];
  preferences: UserPreferences;
  lastLogin?: Date;
}

// 组织类型
export interface Organization {
  id: string;
  name: string;
  type: 'company' | 'school' | 'hospital' | 'gym';
  members: OrganizationMember[];
  admins: string[];
  settings: OrganizationSettings;
  features: OrganizationFeature[];
}

// 仪表板配置
export interface DashboardConfig {
  layout: LayoutConfig;
  widgets: WidgetConfig[];
  filters: FilterConfig[];
  timeRange: TimeRange;
  refreshInterval?: number;
  sharing?: SharingConfig;
}

// 数据视图配置
export interface DataViewConfig {
  type: ViewType;
  data: DataSource[];
  visualization: VisualizationConfig;
  interactions: InteractionConfig[];
  permissions: ViewPermission[];
} 