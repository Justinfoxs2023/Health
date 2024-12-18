import { Logger } from '../utils/logger';
import { Model, Document } from 'mongoose';

export class DatabaseOperations<T extends Document> {
  private logger: Logger;
  private model: Model<T>;

  constructor(model: Model<T>, modelName: string) {
    this.model = model;
    this.logger = new Logger(`DatabaseOperations:${modelName}`);
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      this.logger.error('Create operation failed', error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      this.logger.error('FindById operation failed', error);
      throw error;
    }
  }

  async findOne(conditions: any): Promise<T | null> {
    try {
      return await this.model.findOne(conditions);
    } catch (error) {
      this.logger.error('FindOne operation failed', error);
      throw error;
    }
  }

  async find(
    conditions: any,
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
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      this.logger.error('Update operation failed', error);
      throw error;
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error('Delete operation failed', error);
      throw error;
    }
  }

  async count(conditions: any): Promise<number> {
    try {
      return await this.model.countDocuments(conditions);
    } catch (error) {
      this.logger.error('Count operation failed', error);
      throw error;
    }
  }
}
