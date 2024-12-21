/**
 * @fileoverview TS 文件 tutorial.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 新手引导配置
export interface ITutorialConfig {
   
  /** steps 的描述 */
    steps: {
    id: string;
    title: string;
    description: string;
    target: string;
    position: top  bottom  left  right;
    action: {
      type: click  input  scroll  swipe;
      value: string;
    };
    reward?: {
      exp: number;
      points: number;
      items?: string[];
    };
  }[];

  // 新手特权
  newUserBenefits: {
    duration: number;
    multipliers: {
      exp: number;
      points: number;
    };
    dailyRewards: {
      exp: number;
      points: number;
      items: string[];
    };
  };
}
