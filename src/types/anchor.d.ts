// 锚点类型定义
export interface ContentAnchor {
  id: string;
  contentId: string;  // 关联的内容ID
  contentType: 'diet' | 'post';  // 内容类型
  productId: string;  // 关联的商品ID
  position: {
    start: number;
    end: number;
  };
  text: string;  // 锚点文本
  clicks: number;  // 点击次数
  conversions: number;  // 转化次数
  revenue: number;  // 产生的收入
}

// 奖励规则
export interface RewardRule {
  type: 'click' | 'conversion';
  points: number;  // 基础积分
  commission: {
    rate: number;  // 分成比例
    minimum: number;  // 最低金额
    maximum: number;  // 最高金额
  };
}

// 奖励记录
export interface RewardRecord {
  id: string;
  userId: string;
  anchorId: string;
  type: 'click' | 'conversion';
  points: number;
  commission: number;
  orderId?: string;  // 关联订单ID
  timestamp: Date;
} 