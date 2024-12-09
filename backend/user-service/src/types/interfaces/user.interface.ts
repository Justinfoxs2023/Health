import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  roles: Role[];
  emailVerified: boolean;
  pushToken?: string;
  socialConnections?: {
    [platform: string]: {
      id: string;
      profile: any;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  username: string;
  roles?: Role[];
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
} 