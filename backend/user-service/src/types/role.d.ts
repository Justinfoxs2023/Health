/**
 * @fileoverview TS 文件 role.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 角色类型定义
export type RoleCodeType = 'USER' | 'DOCTOR' | 'HEALTH_ADVISOR' | 'ADMIN';

export interface IRoleConfig {
  /** code 的描述 */
  code: RoleCodeType;
  /** permissions 的描述 */
  permissions: string[];
}

export type RoleConfigMapType = {
  [K in RoleCodeType]: IRoleConfig;
};

export interface IRole {
  /** _id 的描述 */
  _id: string;
  /** code 的描述 */
  code: RoleCodeType;
  /** permissions 的描述 */
  permissions: string[];
}

export interface IUserWithRoles {
  /** _id 的描述 */
  _id: string;
  /** roles 的描述 */
  roles: IRole[];
}
