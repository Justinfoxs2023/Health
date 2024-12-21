import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export abstract class BaseService<T extends Document> {
  protected readonly logger: Logger;

  constructor(protected readonly model: Model<T>, serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  async findOne(conditions: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(conditions);
    } catch (error) {
      this.logger.error(`查询失败: ${error.message}`);
      throw error;
    }
  }

  async find(conditions: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(conditions);
    } catch (error) {
      this.logger.error(`查询失败: ${error.message}`);
      throw error;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = new this.model(data);
      return await entity.save();
    } catch (error) {
      this.logger.error(`创建失败: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      this.logger.error(`更新失败: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      this.logger.error(`删除失败: ${error.message}`);
      throw error;
    }
  }
}
