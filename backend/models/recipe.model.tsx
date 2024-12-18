import mongoose, { Schema } from 'mongoose';
import { IRecipe } from '../types/models';

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      note: String,
    },
  ],
  steps: [
    {
      order: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: String,
      duration: Number,
    },
  ],
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
  },
  occasions: [
    {
      type: String,
      enum: ['早餐', '午餐', '晚餐', '加餐'],
      required: true,
    },
  ],
  difficulty: {
    type: String,
    enum: ['简单', '中等', '困难'],
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
