// 角色类型定义
export type RoleCode = 'USER' | 'DOCTOR' | 'HEALTH_ADVISOR' | 'ADMIN';

export interface RoleConfig {
  code: RoleCode;
  permissions: string[];
}

export type RoleConfigMap = {
  [K in RoleCode]: RoleConfig;
};

export interface IRole {
  _id: string;
  code: RoleCode;
  permissions: string[];
}

export interface IUserWithRoles {
  _id: string;
  roles: IRole[];
} 