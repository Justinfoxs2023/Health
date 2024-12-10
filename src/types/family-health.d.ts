// 家庭成员类型
export interface FamilyMember {
  id: string;
  name: string;
  relation: FamilyRelation;
  birthDate: Date;
  gender: 'male' | 'female';
  bloodType?: string;
  height?: number;
  weight?: number;
  
  // 健康信息
  healthInfo: {
    chronicDiseases?: string[];
    allergies?: string[];
    medications?: MedicationPlan[];
    vaccinations?: VaccinationRecord[];
  };
  
  // 中医体质信息
  tcmConstitution?: {
    type: TCMConstitutionType;
    features: string[];
    suggestions: string[];
  };
}

// 家庭关系
export enum FamilyRelation {
  SELF = 'self',
  SPOUSE = 'spouse',
  CHILD = 'child',
  PARENT = 'parent',
  GRANDPARENT = 'grandparent'
}

// 用药计划
export interface MedicationPlan {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  period: {
    start: Date;
    end?: Date;
  };
  timing: {
    times: string[];  // 每天服用时间点
    withMeal: boolean;
  };
  notes?: string;
  reminders: boolean;
}

// 疫苗接种记录
export interface VaccinationRecord {
  id: string;
  name: string;
  date: Date;
  nextDueDate?: Date;
  hospital: string;
  batchNumber?: string;
}

// 中医体质类型
export enum TCMConstitutionType {
  BALANCED = 'balanced',      // 平和质
  QI_DEFICIENT = 'qiDef',    // 气虚质
  YANG_DEFICIENT = 'yangDef',// 阳虚质
  YIN_DEFICIENT = 'yinDef',  // 阴虚质
  PHLEGM = 'phlegm',         // 痰湿质
  DAMP_HEAT = 'dampHeat',    // 湿热质
  BLOOD_STASIS = 'stasis',   // 血瘀质
  QI_STAGNATION = 'qiStag',  // 气郁质
  SPECIAL = 'special'        // 特禀质
} 