import { IRole } from '../permission.types';
import { IUser } from './user.interface';

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findBySocialId(platform: string, id: string): Promise<IUser | null>;
  update(id: string, data: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<void>;
}

export interface IRoleRepository {
  findById(id: string): Promise<IRole | null>;
  findByIds(ids: string[]): Promise<IRole[]>;
  findByName(name: string): Promise<IRole | null>;
  create(data: Partial<IRole>): Promise<IRole>;
  update(id: string, data: Partial<IRole>): Promise<IRole>;
  delete(id: string): Promise<void>;
}
