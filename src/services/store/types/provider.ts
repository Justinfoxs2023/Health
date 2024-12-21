/**
 * @fileoverview TS 文件 provider.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 服务供应商类型
export interface IServiceProvider {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: hospital  clinic  pharmacy  rehabilitation  fitness;
  status: active  suspended  pending;

   
  basicInfo: {
    logo: string;
    description: string;
    establishedYear: number;
    scale: small  medium  large;
    staffCount: number;
    operatingHours: string;
  };

  // 资质认证
  certifications: Array<{
    type: string;
    number: string;
    issueDate: Date;
    expiryDate: Date;
    status: 'valid' | 'expired' | 'revoked';
    attachments: string[];
  }>;

  // 服务范围
  services: Array<{
    category: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    availability: boolean;
  }>;

  // 专家团队
  experts: Array<{
    id: string;
    name: string;
    title: string;
    specialty: string[];
    experience: number;
    availability: {
      schedule: string;
      nextAvailable: Date;
    };
  }>;

  // 评价指标
  ratings: {
    overall: number;
    serviceQuality: number;
    professional: number;
    facilities: number;
    reviewCount: number;
  };

  // 结算信息
  settlement: {
    bankAccount: string;
    settlementCycle: 'weekly' | 'monthly';
    commissionRate: number;
    minimumPayout: number;
  };
}
