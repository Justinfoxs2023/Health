export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  roles: string[];
  emailVerified: boolean;
  pushToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  username: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface SocialProfile {
  id: string;
  email: string;
  name: string;
  platform: string;
} 