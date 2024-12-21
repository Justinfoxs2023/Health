import mongoose from 'mongoose';

interface ITimestampOptions {
  /** createdAt 的描述 */
  createdAt?: string;
  /** updatedAt 的描述 */
  updatedAt?: string;
  /** currentTime 的描述 */
  currentTime?: () => Date;
}

class TimestampPlugin {
  /**
   * 添加时间戳到schema
   */
  static addTimestamps(schema: mongoose.Schema, options: ITimestampOptions = {}): void {
    const createdAtField = options.createdAt || 'createdAt';
    const updatedAtField = options.updatedAt || 'updatedAt';
    const getCurrentTime = options.currentTime || (() => new Date());

    // 添加时间戳字段
    const schemaAddition: any = {};
    schemaAddition[createdAtField] = { type: Date };
    schemaAddition[updatedAtField] = { type: Date };
    schema.add(schemaAddition);

    // 保存前中间件
    schema.pre('save', function (next) {
      const currentTime = getCurrentTime();

      if (this.isNew) {
        this.set(createdAtField, currentTime);
      }
      this.set(updatedAtField, currentTime);

      next();
    });

    // 更新中间件
    schema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
      const currentTime = getCurrentTime();
      const update = this.getUpdate() as any;

      if (update && !update.$set) {
        update.$set = {};
      }

      update.$set = update.$set || {};
      update.$set[updatedAtField] = currentTime;

      next();
    });

    // 添加查询助手方法
    schema.query.byTimeRange = function (field: string, startDate?: Date, endDate?: Date) {
      const query: any = {};

      if (startDate || endDate) {
        query[field] = {};
        if (startDate) {
          query[field].$gte = startDate;
        }
        if (endDate) {
          query[field].$lte = endDate;
        }
        return this.where(query);
      }

      return this;
    };

    // 添加实例方法
    schema.methods.touch = async function (fields?: string[]): Promise<void> {
      const currentTime = getCurrentTime();
      const updates: any = {
        [updatedAtField]: currentTime,
      };

      if (fields && Array.isArray(fields)) {
        fields.forEach(field => {
          updates[field] = currentTime;
        });
      }

      Object.assign(this, updates);
      await this.save();
    };

    // 添加静态方法
    schema.statics.findByTimeRange = async function (
      field: string,
      startDate?: Date,
      endDate?: Date,
    ) {
      return this.find().byTimeRange(field, startDate, endDate);
    };

    schema.statics.findOneByTimeRange = async function (
      field: string,
      startDate?: Date,
      endDate?: Date,
    ) {
      return this.findOne().byTimeRange(field, startDate, endDate);
    };

    schema.statics.countByTimeRange = async function (
      field: string,
      startDate?: Date,
      endDate?: Date,
    ) {
      return this.find().byTimeRange(field, startDate, endDate).countDocuments();
    };

    // 添加虚拟字段
    schema.virtual('age').get(function () {
      const createdAt = this.get(createdAtField);
      if (!createdAt) return null;

      const now = getCurrentTime();
      const ageInMs = now.getTime() - createdAt.getTime();
      return {
        milliseconds: ageInMs,
        seconds: Math.floor(ageInMs / 1000),
        minutes: Math.floor(ageInMs / (1000 * 60)),
        hours: Math.floor(ageInMs / (1000 * 60 * 60)),
        days: Math.floor(ageInMs / (1000 * 60 * 60 * 24)),
      };
    });

    // 添加索引
    schema.index({ [createdAtField]: -1 });
    schema.index({ [updatedAtField]: -1 });
  }

  /**
   * 添加版本控制
   */
  static addVersioning(schema: mongoose.Schema): void {
    schema.add({
      version: { type: Number, default: 0 },
    });

    schema.pre('save', function (next) {
      if (this.isModified()) {
        this.increment();
      }
      next();
    });
  }

  /**
   * 添加软删除支持
   */
  static addSoftDelete(schema: mongoose.Schema): void {
    schema.add({
      deletedAt: { type: Date, default: null },
    });

    // 添加查询中间件
    schema.pre(['find', 'findOne'], function (next) {
      if (!(this as any)._conditions.includeDeleted) {
        this.where({ deletedAt: null });
      }
      next();
    });

    // 添加软删除方法
    schema.methods.softDelete = async function (): Promise<void> {
      this.set('deletedAt', new Date());
      await this.save();
    };

    // 添加恢复方法
    schema.methods.restore = async function (): Promise<void> {
      this.set('deletedAt', null);
      await this.save();
    };

    // 添加静态方法
    schema.statics.findWithDeleted = function () {
      return this.find().where({ includeDeleted: true });
    };
  }
}

// 导出插件
export { TimestampPlugin, ITimestampOptions };

// 默认导出插件函数
export default function (schema: mongoose.Schema, options?: ITimestampOptions): void {
  TimestampPlugin.addTimestamps(schema, options);
}
