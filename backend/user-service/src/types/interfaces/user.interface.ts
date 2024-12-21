import { Role } from '../enums/role.enum';

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
  roles: Role[];
  /** emailVerified 的描述 */
  emailVerified: boolean;
  /** pushToken 的描述 */
  pushToken?: string;
  /** socialConnections 的描述 */
  socialConnections?: {
    [platform: string]: {
      id: string;
      profile: any;
    };
  };
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
  /** roles 的描述 */
  roles?: Role[];
}

export interface IUpdateUserDTO {
  /** username 的描述 */
  username?: string;
  /** email 的描述 */
  email?: string;
  /** password 的描述 */
  password?: string;
}
