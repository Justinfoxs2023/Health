/**
 * @fileoverview TS 文件 group-purchase.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 团购活动
export interface IGroupPurchase {
  /** id 的描述 */
    id: string;
  /** productId 的描述 */
    productId: string;
  /** minParticipants 的描述 */
    minParticipants: number;
  /** maxParticipants 的描述 */
    maxParticipants: number;
  /** currentParticipants 的描述 */
    currentParticipants: number;

  /** pricing 的描述 */
    pricing: {
    originalPrice: number;
    groupPrice: number;
    thresholds: Array{
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
