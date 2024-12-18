import { AppError } from '../utils/errors';
import { Logger } from '../utils/logger';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;
  protected logger: Logger;

  constructor(model: Model<T>, modelName: string) {
    this.model = model;
    this.logger = new Logger(`${modelName}Repository`);
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      this.logger.error('Create operation failed', error);
      throw new AppError('创建数据失败', 500);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      this.logger.error('FindById operation failed', error);
      throw new AppError('查询数据失败', 500);
    }
  }

  async findOne(conditions: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(conditions);
    } catch (error) {
      this.logger.error('FindOne operation failed', error);
      throw new AppError('查询数据失败', 500);
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      this.logger.error('Update operation failed', error);
      throw new AppError('更新数据失败', 500);
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error('Delete operation failed', error);
      throw new AppError('删除数据失败', 500);
    }
  }

  async find(
    conditions: FilterQuery<T>,
    options?: {
      skip?: number;
      limit?: number;
      sort?: any;
    },
  ): Promise<T[]> {
    try {
      let query = this.model.find(conditions);

      if (options?.sort) {
        query = query.sort(options.sort);
      }
      if (options?.skip) {
        query = query.skip(options.skip);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      return await query.exec();
    } catch (error) {
      this.logger.error('Find operation failed', error);
      throw new AppError('查询数据失败', 500);
    }
  }
}
