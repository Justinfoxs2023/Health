/**
 * @fileoverview TS 文件 family-health.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 家庭成员类型
export interface IFamilyMember {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** relation 的描述 */
  relation: import("D:/Health/src/types/family-health").FamilyRelation.SELF | import("D:/Health/src/types/family-health").FamilyRelation.SPOUSE | import("D:/Health/src/types/family-health").FamilyRelation.CHILD | import("D:/Health/src/types/family-health").FamilyRelation.PARENT | import("D:/Health/src/types/family-health").FamilyRelation.GRANDPARENT;
  /** birthDate 的描述 */
  birthDate: Date;
  /** gender 的描述 */
  gender: male /** female 的描述 */;
  /** female 的描述 */
  female;
  /** bloodType 的描述 */
  bloodType: string;
  /** height 的描述 */
  height: number;
  /** weight 的描述 */
  weight: number;

  /** healthInfo 的描述 */
  healthInfo: {
    chronicDiseases: string;
    allergies: string;
    medications: IMedicationPlan;
    vaccinations: IVaccinationRecord;
  };

  // 中医体质信息
  /** tcmConstitution 的描述 */
  tcmConstitution?: undefined | { type: any; features: string[]; suggestions: string[]; };
}

// 家庭关系
export enum FamilyRelation {
  SELF = 'self',
  SPOUSE = 'spouse',
  CHILD = 'child',
  PARENT = 'parent',
  GRANDPARENT = 'grandparent',
}

// 用药计划
export interface IMedicationPlan {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** dosage 的描述 */
  dosage: string;
  /** frequency 的描述 */
  frequency: string;
  /** period 的描述 */
  period: {
    start: Date;
    end: Date;
  };
  /** timing 的描述 */
  timing: {
    times: string[]; // 每天服用时间点
    withMeal: boolean;
  };
  /** notes 的描述 */
  notes?: undefined | string;
  /** reminders 的描述 */
  reminders: false | true;
}

// 疫苗接种记录
export interface IVaccinationRecord {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** date 的描述 */
  date: Date;
  /** nextDueDate 的描述 */
  nextDueDate: Date;
  /** hospital 的描述 */
  hospital: string;
  /** batchNumber 的描述 */
  batchNumber: string;
}

// 中医体质类型
export enum TCMConstitutionType {
  BALANCED = 'balanced', // 平和质
  QI_DEFICIENT = 'qiDef', // 气虚质
  YANG_DEFICIENT = 'yangDef', // 阳虚质
  YIN_DEFICIENT = 'yinDef', // 阴虚质
  PHLEGM = 'phlegm', // 痰湿质
  DAMP_HEAT = 'dampHeat', // 湿热质
  BLOOD_STASIS = 'stasis', // 血瘀质
  QI_STAGNATION = 'qiStag', // 气郁质
  SPECIAL = 'special', // 特禀质
}
