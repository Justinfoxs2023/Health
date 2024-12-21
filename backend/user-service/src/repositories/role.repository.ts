import { IRole } from '../types/permission.types';

export interface IRoleRepository {
  findById(id: string): Promise<IRole | null>;
  findByIds(ids: string[]): Promise<IRole[]>;
  findByName(name: string): Promise<IRole | null>;
  create(data: Partial<IRole>): Promise<IRole>;
  update(id: string, data: Partial<IRole>): Promise<IRole>;
  delete(id: string): Promise<void>;
}
