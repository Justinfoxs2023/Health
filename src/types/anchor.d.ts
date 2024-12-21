/**
 * @fileoverview TS 文件 anchor.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 锚点类型定义
export interface IContentAnchor {
  /** id 的描述 */
  id: string;
  /** contentId 的描述 */
  contentId: string /** ID 的描述 */;
  /** ID 的描述 */
  ID;
  /** contentType 的描述 */
  contentType: diet /** post 的描述 */;
  /** post 的描述 */
  post;
  /** productId 的描述 */
  productId: string /** ID 的描述 */;
  /** ID 的描述 */
  ID;
  /** position 的描述 */
  position: {
    start: number;
    end: number;
  };
  /** text 的描述 */
  text: string; // 锚点文本
  /** clicks 的描述 */
  clicks: number; // 点击次数
  /** conversions 的描述 */
  conversions: number; // 转化次数
  /** revenue 的描述 */
  revenue: number; // 产生的收入
}

// 奖励规则
export interface IRewardRule {
  /** type 的描述 */
  type: click /** conversion 的描述 */;
  /** conversion 的描述 */
  conversion;
  /** points 的描述 */
  points: number;
  /** commission 的描述 */
  commission: {
    rate: number;
    minimum: number;
    maximum: number;
  };
}

// 奖励记录
export interface IRewardRecord {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** anchorId 的描述 */
  anchorId: string;
  /** type 的描述 */
  type: click /** conversion 的描述 */;
  /** conversion 的描述 */
  conversion;
  /** points 的描述 */
  points: number;
  /** commission 的描述 */
  commission: number;
  /** orderId 的描述 */
  orderId: string /** ID 的描述 */;
  /** ID 的描述 */
  ID;
  /** timestamp 的描述 */
  timestamp: Date;
}
