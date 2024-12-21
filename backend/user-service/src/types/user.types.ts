/**
 * @fileoverview TS 文件 user.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IUser {
  /** id 的描述 */
  id: string;
  /** email 的描述 */
  email: string;
  /** username 的描述 */
  username: string;
  /** password 的描述 */
  password: string;
  /** roles 的描述 */
  roles: string[];
  /** emailVerified 的描述 */
  emailVerified: boolean;
  /** pushToken 的描述 */
  pushToken?: string;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface ICreateUserDTO {
  /** email 的描述 */
  email: string;
  /** password 的描述 */
  password: string;
  /** username 的描述 */
  username: string;
}

export interface IUpdateUserDTO {
  /** username 的描述 */
  username?: string;
  /** email 的描述 */
  email?: string;
  /** password 的描述 */
  password?: string;
}

export interface IAuthToken {
  /** accessToken 的描述 */
  accessToken: string;
  /** refreshToken 的描述 */
  refreshToken: string;
}

export interface ISocialProfile {
  /** id 的描述 */
  id: string;
  /** email 的描述 */
  email: string;
  /** name 的描述 */
  name: string;
  /** platform 的描述 */
  platform: string;
}
