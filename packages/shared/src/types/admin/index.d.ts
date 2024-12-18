/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 管理端基础类型
export interface IAdminConfig {
  /** roles 的描述 */
  roles: IAdminRole[];
  /** permissions 的描述 */
  permissions: IPermission[];
  /** features 的描述 */
  features: IFeature[];
  /** settings 的描述 */
  settings: IAdminSettings;
}

// 管理角色
export interface IAdminRole {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** level 的描述 */
  level: number;
  /** permissions 的描述 */
  permissions: string[];
  /** features 的描述 */
  features: string[];
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 权限定义
export interface IPermission {
  /** id 的描述 */
  id: string;
  /** code 的描述 */
  code: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: 'read' | 'write' | 'admin';
  /** resource 的描述 */
  resource: string;
}

// 功能定义
export interface IFeature {
  /** id 的描述 */
  id: string;
  /** code 的描述 */
  code: string;
  /** name 的描述 */
  name: string;
  /** status 的描述 */
  status: 'enabled' | 'disabled';
  /** config 的描述 */
  config: any;
}

// 管理设置
export interface IAdminSettings {
  /** security 的描述 */
  security: SecuritySettings;
  /** notification 的描述 */
  notification: NotificationSettings;
  /** audit 的描述 */
  audit: AuditSettings;
  /** ui 的描述 */
  ui: UISettings;
}
