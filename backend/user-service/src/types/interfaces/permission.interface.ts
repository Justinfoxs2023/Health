/**
 * @fileoverview TS 文件 permission.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IPermission {
  /** id 的描述 */
  id: string;
  /** code 的描述 */
  code: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description?: string;
  /** resource 的描述 */
  resource: string;
  /** action 的描述 */
  action: string;
  /** conditions 的描述 */
  conditions?: IPermissionCondition[];
}

export interface IPermissionCondition {
  /** field 的描述 */
  field: string;
  /** operator 的描述 */
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'nin';
  /** value 的描述 */
  value: any;
}

export interface IRole {
  /** id 的描述 */
  id: string;
  /** code 的描述 */
  code: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description?: string;
  /** permissions 的描述 */
  permissions: string[];
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface IUserPermissions {
  /** userId 的描述 */
  userId: string;
  /** roles 的描述 */
  roles: string[];
  /** permissions 的描述 */
  permissions: string[];
  /** customPermissions 的描述 */
  customPermissions?: IPermission[];
}
