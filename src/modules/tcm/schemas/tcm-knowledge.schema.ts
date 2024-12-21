import { Schema } from 'mongoose';

export const TCMKnowledgeSchema = new Schema(
  {
    // 基础字段
    type: { type: String, required: true },
    name: { type: String },
    description: { type: String },

    // 分类信息
    category: { type: String },
    tags: [String],

    // 季节相关
    season: { type: String },

    // 体质相关
    constitution: { type: String },

    // 食物相关
    foods: [String],

    // 生活起居
    routine: [String],
    habits: [String],
    precautions: [String],

    // 运动相关
    exercises: [String],
    adjustments: { type: Map, of: String },

    // 保健措施
    measures: [String],
    daily: [String],

    // 经络穴位
    points: [
      {
        name: String,
        location: String,
        functions: [String],
        indications: [String],
      },
    ],

    // 推拿手法
    techniques: [
      {
        name: String,
        description: String,
        applications: [String],
        precautions: [String],
      },
    ],

    // 养生功法
    healthExercises: [
      {
        name: String,
        description: String,
        steps: [String],
        benefits: [String],
        precautions: [String],
      },
    ],

    // 元数据
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'tcm_knowledge',
  },
);
