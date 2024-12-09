// 运动数据
export interface ExerciseData {
  id: string;
  userId: string;
  timestamp: Date;
  type: ExerciseType;
  duration: number;  // 分钟
  intensity: 'low' | 'medium' | 'high';
  metrics: {
    heartRate: number[];     // 心率数据
    calories: number;        // 消耗卡路里
    steps?: number;         // 步数
    distance?: number;      // 距离(米)
    pace?: number;         // 配速
    elevation?: number;    // 海拔变化
  };
  segments?: ExerciseSegment[];  // 运动分段
  location?: GeoLocation[];     // 运动轨迹
}

// 饮食数据
export interface DietData {
  id: string;
  userId: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: FoodItem[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    vitamins: VitaminIntake;
    minerals: MineralIntake;
  };
  waterIntake: number;  // 毫升
  mood?: string;       // 进食心情
  location?: string;   // 用餐地点
}

// 身体数据
export interface BodyData {
  id: string;
  userId: string;
  timestamp: Date;
  measurements: {
    weight: number;      // 公斤
    height: number;      // 厘米
    bmi: number;
    bodyFat: number;     // 体脂率
    muscleMass: number;  // 肌肉量
    boneMass: number;    // 骨量
    visceralFat: number; // 内脏脂肪
    waistline: number;   // 腰围
    metabolism: number;  // 基础代谢率
  };
  composition: {
    water: number;      // 体水分
    protein: number;    // 蛋白质
    mineral: number;    // 无机盐
  };
  symmetry?: {
    leftRight: number;  // 左右对称性
    upDown: number;     // 上下对称性
  };
}

// 数据分析配置
export interface AnalysisConfig {
  timeRange: {
    start: Date;
    end: Date;
    interval?: 'hour' | 'day' | 'week' | 'month';
  };
  metrics: string[];
  dimensions?: string[];
  filters?: DataFilter[];
  aggregation?: AggregationConfig;
  comparison?: ComparisonConfig;
}

// 数据过滤器
export interface DataFilter {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'between' | 'in';
  value: any;
  logic?: 'and' | 'or';
}

// 聚合配置
export interface AggregationConfig {
  type: 'sum' | 'avg' | 'min' | 'max' | 'count';
  groupBy?: string[];
  having?: DataFilter[];
} 