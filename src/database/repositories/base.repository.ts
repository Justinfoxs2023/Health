import { NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository()
export class BaseRepository<T> extends Repository<T> {
  async findOneOrFail(id: string): Promise<T> {
    try {
      return await this.findOneBy({ id } as any);
    } catch (error) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return await this.findBy({ id: { $in: ids } } as any);
  }

  async softDelete(id: string): Promise<void> {
    await this.update(id, {
      deletedAt: new Date(),
      isActive: false,
    } as any);
  }

  async restore(id: string): Promise<void> {
    await this.update(id, {
      deletedAt: null,
      isActive: true,
    } as any);
  }
}
