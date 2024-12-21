/**
 * @fileoverview TS 文件 nutrition.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IDietPlan {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** nutritionistId 的描述 */
  nutritionistId: string;
  /** meals 的描述 */
  meals: IMealPlan[];
  /** goals 的描述 */
  goals: INutritionGoal;
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate: Date;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface IMealPlan {
  /** time 的描述 */
  time: string;
  /** foods 的描述 */
  foods: IFood[];
  /** calories 的描述 */
  calories: number;
  /** nutrients 的描述 */
  nutrients: INutrients;
}

export interface IFood {
  /** name 的描述 */
  name: string;
  /** amount 的描述 */
  amount: number;
  /** unit 的描述 */
  unit: string;
  /** calories 的描述 */
  calories: number;
  /** nutrients 的描述 */
  nutrients: INutrients;
}

export interface INutrients {
  /** protein 的描述 */
  protein: number;
  /** carbs 的描述 */
  carbs: number;
  /** fat 的描述 */
  fat: number;
  /** fiber 的描述 */
  fiber: number;
  /** vitamins 的描述 */
  vitamins?: { [key: string]: number };
  /** minerals 的描述 */
  minerals?: { [key: string]: number };
}

export interface IMealRecord {
  /** id 的描述 */
  id: string;
  /** clientId 的描述 */
  clientId: string;
  /** date 的描述 */
  date: Date;
  /** meal 的描述 */
  meal: IMealPlan;
  /** actualFoods 的描述 */
  actualFoods: IFood[];
  /** photos 的描述 */
  photos?: string[];
  /** notes 的描述 */
  notes?: string;
}

export interface INutritionGoal {
  /** dailyCalories 的描述 */
  dailyCalories: number;
  /** macroRatio 的描述 */
  macroRatio: {
    protein: number;
    carbs: number;
    fat: number;
  };
  /** restrictions 的描述 */
  restrictions?: string[];
  /** preferences 的描述 */
  preferences?: string[];
  /** targetWeight 的描述 */
  targetWeight?: number;
  /** targetDate 的描述 */
  targetDate?: Date;
}
