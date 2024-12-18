/**
 * @fileoverview TS 文件 FoodTypes.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IFoodInfo {
  /** foodName 的描述 */
  foodName: string;
  /** confidence 的描述 */
  confidence: number;
  /** category 的描述 */
  category: string;
  /** nutrition 的描述 */
  nutrition: INutritionInfo;
  /** timestamp 的描述 */
  timestamp: Date;
}

export interface INutritionInfo {
  /** calories 的描述 */
  calories: number;
  /** protein 的描述 */
  protein: number;
  /** carbohydrates 的描述 */
  carbohydrates: number;
  /** fat 的描述 */
  fat: number;
  /** fiber 的描述 */
  fiber: number;
  /** vitamins 的描述 */
  vitamins: IVitaminInfo;
  /** minerals 的描述 */
  minerals: IMineralInfo;
  /** servingSize 的描述 */
  servingSize: string;
}

export interface IVitaminInfo {
  /** vitaminA 的描述 */
  vitaminA: number;
  /** vitaminB1 的描述 */
  vitaminB1: number;
  /** vitaminB2 的描述 */
  vitaminB2: number;
  /** vitaminB6 的描述 */
  vitaminB6: number;
  /** vitaminB12 的描述 */
  vitaminB12: number;
  /** vitaminC 的描述 */
  vitaminC: number;
  /** vitaminD 的描述 */
  vitaminD: number;
  /** vitaminE 的描述 */
  vitaminE: number;
  /** vitaminK 的描述 */
  vitaminK: number;
}

export interface IMineralInfo {
  /** calcium 的描述 */
  calcium: number;
  /** iron 的描述 */
  iron: number;
  /** magnesium 的描述 */
  magnesium: number;
  /** phosphorus 的描述 */
  phosphorus: number;
  /** potassium 的描述 */
  potassium: number;
  /** sodium 的描述 */
  sodium: number;
  /** zinc 的描述 */
  zinc: number;
}
