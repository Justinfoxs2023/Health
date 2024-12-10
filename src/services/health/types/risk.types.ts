// 生活方式风险
export interface LifestyleRisk {
  category: 'diet' | 'exercise' | 'sleep' | 'stress' | 'substance';
  level: 'low' | 'moderate' | 'high';
  factors: string[];
  impact: {
    immediate: string[];
    longTerm: string[];
  };
  recommendations: {
    priority: 'urgent' | 'important' | 'recommended';
    actions: string[];
    resources: string[];
  };
}

// 遗传风险
export interface GeneticRisk {
  condition: string;
  probability: number;
  inheritance: 'dominant' | 'recessive' | 'complex';
  variants: Array<{
    gene: string;
    mutation: string;
    significance: string;
  }>;
  preventiveMeasures: string[];
  monitoringPlan: {
    tests: string[];
    frequency: string;
    indicators: string[];
  };
}

// 环境风险
export interface EnvironmentalRisk {
  type: 'physical' | 'chemical' | 'biological' | 'social';
  source: string;
  exposure: {
    level: number;
    duration: string;
    frequency: string;
  };
  potentialImpact: {
    immediate: string[];
    chronic: string[];
    conditions: string[];
  };
  preventiveMeasures: {
    personal: string[];
    environmental: string[];
    monitoring: string[];
  };
}

// 风险阈值
export interface RiskThreshold {
  metric: string;
  ranges: {
    normal: [number, number];
    warning: [number, number];
    critical: [number, number];
  };
  adjustments: {
    age: Record<string, number>;
    gender: Record<string, number>;
    condition: Record<string, number>;
  };
  monitoring: {
    frequency: string;
    method: string;
    accuracy: number;
  };
} 