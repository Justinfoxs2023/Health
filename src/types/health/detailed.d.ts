/**
 * @fileoverview TS 文件 detailed.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 运动数据
export interface IExerciseData {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: ExerciseType;
  /** duration 的描述 */
    duration: number;  
  /** intensity 的描述 */
    intensity: low  medium  high;
  metrics: {
    heartRate: number;  
    calories: number;  
    steps: number;  
    distance: number;  
    pace: number;  
    elevation: number;  
  };
  segments?: ExerciseSegment[]; // 运动分段
  location?: GeoLocation[]; // 运动轨迹
}

// 饮食数据
export interface IDietData {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** mealType 的描述 */
    mealType: breakfast  lunch  dinner  snack;
  items: FoodItem;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    vitamins: VitaminIntake;
    minerals: MineralIntake;
  };
  waterIntake: number; // 毫升
  mood?: string; // 进食心情
  location?: string; // 用餐地点
}

// 身体数据
export interface IBodyData {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** measurements 的描述 */
    measurements: {
    weight: number;  
    height: number;  
    bmi: number;
    bodyFat: number;  
    muscleMass: number;  
    boneMass: number;  
    visceralFat: number;  
    waistline: number;  
    metabolism: number;  
  };
  /** composition 的描述 */
    composition: {
    water: number; // 体水分
    protein: number; // 蛋白质
    mineral: number; // 无机盐
  };
  /** symmetry 的描述 */
    symmetry?: undefined | { leftRight: number; upDown: number; };
}

// 数据分析配置
export interface IAnalysisConfig {
  /** timeRange 的描述 */
    timeRange: {
    start: Date;
    end: Date;
    interval: hour  day  week  month;
  };
  metrics: string[];
  dimensions?: string[];
  filters?: DataFilter[];
  aggregation?: AggregationConfig;
  comparison?: ComparisonConfig;
}

// 数据过滤器
export interface IDataFilter {
  /** field 的描述 */
    field: string;
  /** operator 的描述 */
    operator: eq  gt  lt  between  in;
  value: any;
  logic: and  or;
}

// 聚合配置
export interface IAggregationConfig {
  /** type 的描述 */
    type: sum  avg  min  max  count;
  groupBy: string;
  having: DataFilter;
}
