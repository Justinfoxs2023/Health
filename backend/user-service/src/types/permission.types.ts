/**
 * @fileoverview TS 文件 permission.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IPermission {
  /** resource 的描述 */
  resource: ResourceType;
  /** actions 的描述 */
  actions: string[];
}

export type ResourceType = 'users' | 'profiles' | 'health_records' | 'settings';

export interface IRole {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** permissions 的描述 */
  permissions: IPermission[];
}
