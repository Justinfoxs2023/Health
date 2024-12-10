// 会员体系
export interface Membership {
  id: string;
  userId: string;
  level: 'regular' | 'silver' | 'gold' | 'platinum';
  points: number;
  benefits: MembershipBenefits;
  validUntil: Date;
  joinDate: Date;
  growthValue: number;
  status: 'active' | 'inactive' | 'expired';
}

// 会员权益
export interface MembershipBenefits {
  discountRate: number;
  pointsMultiplier: number;
  freeShipping: boolean;
  priorityService: boolean;
  exclusiveProducts: boolean;
  birthdayGifts: boolean;
  healthConsultation: {
    freeCount: number;
    discountRate: number;
  };
  insuranceDiscount?: {
    rate: number;
    maxAmount: number;
  };
} 