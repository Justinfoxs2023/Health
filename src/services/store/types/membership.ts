/**
 * @fileoverview TS 文件 membership.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 会员体系
export interface IMembership {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** level 的描述 */
    level: regular  silver  gold  platinum;
  points: number;
  benefits: MembershipBenefits;
  validUntil: Date;
  joinDate: Date;
  growthValue: number;
  status: active  inactive  expired;
}

// 会员权益
export interface IMembershipBenefits {
  /** discountRate 的描述 */
    discountRate: number;
  /** pointsMultiplier 的描述 */
    pointsMultiplier: number;
  /** freeShipping 的描述 */
    freeShipping: false | true;
  /** priorityService 的描述 */
    priorityService: false | true;
  /** exclusiveProducts 的描述 */
    exclusiveProducts: false | true;
  /** birthdayGifts 的描述 */
    birthdayGifts: false | true;
  /** healthConsultation 的描述 */
    healthConsultation: {
    freeCount: number;
    discountRate: number;
  };
  /** insuranceDiscount 的描述 */
    insuranceDiscount?: undefined | { rate: number; maxAmount: number; };
}
