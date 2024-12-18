import mongoose, { Schema } from 'mongoose';

interface IFood extends Document {
  /** name 的描述 */
  name: string;
  /** category 的描述 */
  category: string;
  /** nutrition 的描述 */
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber?: number;
    vitamins?: Record<string, number>;
    minerals?: Record<string, number>;
  };
  /** unit 的描述 */
  unit: string;
  /** servingSize 的描述 */
  servingSize: number;
  /** season 的描述 */
  season?: string[];
  /** tags 的描述 */
  tags: string[];
  /** isAllergenic 的描述 */
  isAllergenic: boolean;
  /** allergens 的描述 */
  allergens?: string[];
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

const FoodSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['谷物', '蛋白质', '蔬菜', '水果', '乳制品', '油脂', '调味品', '其他'],
  },
  nutrition: {
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    carbohydrates: {
      type: Number,
      required: true,
    },
    fiber: Number,
    vitamins: {
      type: Map,
      of: Number,
    },
    minerals: {
      type: Map,
      of: Number,
    },
  },
  unit: {
    type: String,
    required: true,
  },
  servingSize: {
    type: Number,
    required: true,
  },
  season: [
    {
      type: String,
      enum: ['春', '夏', '秋', '冬'],
    },
  ],
  tags: [String],
  isAllergenic: {
    type: Boolean,
    default: false,
  },
  allergens: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

FoodSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Food = mongoose.model<IFood>('Food', FoodSchema);
