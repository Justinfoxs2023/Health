import { Schema } from 'mongoose';

export const SeasonalDataSchema = new Schema(
  {
    // 基础字段
    type: { type: String, required: true },
    season: { type: String },
    solarTerm: { type: String },

    // 季节特征
    climate: { type: String },
    characteristics: [String],
    healthFocus: [String],
    precautions: [String],

    // 季节转换
    fromSeason: { type: String },
    toSeason: { type: String },
    dietaryAdjustments: [String],
    lifestyleChanges: [String],
    healthPrecautions: [String],

    // 养生重点
    focus: [String],
    methods: [String],
    recommendations: [String],

    // 节气养生
    dietary: [String],
    lifestyle: [String],
    healthcare: [String],

    // 元数据
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'seasonal_data',
  },
);
