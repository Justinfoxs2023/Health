declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// 健康相关类型定义
declare namespace Health {
  interface Trend {
    date: string;
    bmi: number;
    healthScore: number;
    exerciseScore: number;
  }

  interface Metric {
    id: string;
    name: string;
    value: number;
    unit: string;
    date: string;
  }
} 