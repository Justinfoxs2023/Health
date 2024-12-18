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
  contentId: string; // 关联的内容ID
  /** contentType 的描述 */
  contentType: 'diet' | 'post'; // 内容类型
  /** productId 的描述 */
  productId: string; // 关联的商品ID
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
  type: 'click' | 'conversion';
  /** points 的描述 */
  points: number; // 基础积分
  /** commission 的描述 */
  commission: {
    rate: number; // 分成比例
    minimum: number; // 最低金额
    maximum: number; // 最高金额
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
  type: 'click' | 'conversion';
  /** points 的描述 */
  points: number;
  /** commission 的描述 */
  commission: number;
  /** orderId 的描述 */
  orderId?: string; // 关联订单ID
  /** timestamp 的描述 */
  timestamp: Date;
}
