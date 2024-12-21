import { IUser } from '../../types/interfaces/user.interface';

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findBySocialId(platform: string, id: string): Promise<IUser | null>;
  update(id: string, data: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<void>;
}

export { IUserRepository as UserRepository };
