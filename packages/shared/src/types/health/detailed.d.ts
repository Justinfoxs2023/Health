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
  duration: number; // 分钟
  /** intensity 的描述 */
  intensity: 'low' | 'medium' | 'high';
  /** metrics 的描述 */
  metrics: {
    heartRate: number[]; // 心率数据
    calories: number; // 消耗卡路里
    steps?: number; // 步数
    distance?: number; // 距离(米)
    pace?: number; // 配速
    elevation?: number; // 海拔变化
  };
  /** segments 的描述 */
  segments?: ExerciseSegment[]; // 运动分段
  /** location 的描述 */
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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /** items 的描述 */
  items: FoodItem[];
  /** nutrition 的描述 */
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    vitamins: VitaminIntake;
    minerals: MineralIntake;
  };
  /** waterIntake 的描述 */
  waterIntake: number; // 毫升
  /** mood 的描述 */
  mood?: string; // 进食心情
  /** location 的描述 */
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
    weight: number; // 公斤
    height: number; // 厘米
    bmi: number;
    bodyFat: number; // 体脂率
    muscleMass: number; // 肌肉量
    boneMass: number; // 骨量
    visceralFat: number; // 内脏脂肪
    waistline: number; // 腰围
    metabolism: number; // 基础代谢率
  };
  /** composition 的描述 */
  composition: {
    water: number; // 体水分
    protein: number; // 蛋白质
    mineral: number; // 无机盐
  };
  /** symmetry 的描述 */
  symmetry?: {
    leftRight: number; // 左右对称性
    upDown: number; // 上下对称性
  };
}

// 数据分析配置
export interface IAnalysisConfig {
  /** timeRange 的描述 */
  timeRange: {
    start: Date;
    end: Date;
    interval?: 'hour' | 'day' | 'week' | 'month';
  };
  /** metrics 的描述 */
  metrics: string[];
  /** dimensions 的描述 */
  dimensions?: string[];
  /** filters 的描述 */
  filters?: IDataFilter[];
  /** aggregation 的描述 */
  aggregation?: IAggregationConfig;
  /** comparison 的描述 */
  comparison?: ComparisonConfig;
}

// 数据过滤器
export interface IDataFilter {
  /** field 的描述 */
  field: string;
  /** operator 的描述 */
  operator: 'eq' | 'gt' | 'lt' | 'between' | 'in';
  /** value 的描述 */
  value: any;
  /** logic 的描述 */
  logic?: 'and' | 'or';
}

// 聚合配置
export interface IAggregationConfig {
  /** type 的描述 */
  type: 'sum' | 'avg' | 'min' | 'max' | 'count';
  /** groupBy 的描述 */
  groupBy?: string[];
  /** having 的描述 */
  having?: IDataFilter[];
}
