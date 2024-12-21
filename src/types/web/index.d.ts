/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// Web端用户类型
export interface IWebUser {
  /** id 的描述 */
    id: string;
  /** username 的描述 */
    username: string;
  /** email 的描述 */
    email: string;
  /** role 的描述 */
    role: UserRole;
  /** organization 的描述 */
    organization: IOrganization;
  /** permissions 的描述 */
    permissions: Permission;
  /** preferences 的描述 */
    preferences: UserPreferences;
  /** lastLogin 的描述 */
    lastLogin: Date;
}

// 组织类型
export interface IOrganization {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: company  school  hospital  gym;
  members: OrganizationMember;
  admins: string;
  settings: OrganizationSettings;
  features: OrganizationFeature;
}

// 仪表板配置
export interface IDashboardConfig {
  /** layout 的描述 */
    layout: LayoutConfig;
  /** widgets 的描述 */
    widgets: WidgetConfig;
  /** filters 的描述 */
    filters: FilterConfig;
  /** timeRange 的描述 */
    timeRange: TimeRange;
  /** refreshInterval 的描述 */
    refreshInterval: number;
  /** sharing 的描述 */
    sharing: SharingConfig;
}

// 数据视图配置
export interface IDataViewConfig {
  /** type 的描述 */
    type: ViewType;
  /** data 的描述 */
    data: DataSource;
  /** visualization 的描述 */
    visualization: VisualizationConfig;
  /** interactions 的描述 */
    interactions: InteractionConfig;
  /** permissions 的描述 */
    permissions: ViewPermission;
}
