// 团购活动
export interface GroupPurchase {
  id: string;
  productId: string;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  
  pricing: {
    originalPrice: number;
    groupPrice: number;
    thresholds: Array<{
      count: number;
      price: number;
    }>;
  };
  
  timeline: {
    startTime: Date;
    endTime: Date;
    groupFormDeadline: Date;
  };
  
  participants: Array<{
    userId: string;
    joinTime: Date;
    paymentStatus: 'pending' | 'paid';
    isGroupLeader: boolean;
  }>;
  
  status: 'forming' | 'success' | 'failed';
  rules: string[];
} 