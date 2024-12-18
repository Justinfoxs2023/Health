/**
 * @fileoverview TS 文件 nutrition.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface INutritionPlan {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** requirements 的描述 */
  requirements: NutritionRequirements;
  /** meals 的描述 */
  meals: MealPlan;
  /** restrictions 的描述 */
  restrictions: DietaryRestriction;
  /** preferences 的描述 */
  preferences: DietaryPreference;
  /** goals 的描述 */
  goals: NutritionGoal;
}

export interface IMealRecord {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** planId 的描述 */
  planId: string;
  /** type 的描述 */
  type: string;
  /** items 的描述 */
  items: FoodItem;
  /** nutrition 的描述 */
  nutrition: NutritionInfo;
  /** timestamp 的描述 */
  timestamp: Date;
}

export interface INutritionAnalysis {
  /** intake 的描述 */
  intake: NutrientIntake;
  /** patterns 的描述 */
  patterns: EatingPattern;
  /** balance 的描述 */
  balance: NutritionBalance;
  /** recommendations 的描述 */
  recommendations: Recommendation;
}
