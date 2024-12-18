/**
 * @fileoverview TS 文件 family-health.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 家庭成员类型
export interface IFamilyMember {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** relationshipType 的描述 */
  relationshipType: 'spouse' | 'child' | 'parent' | 'grandparent' | 'other';
  /** nickname 的描述 */
  nickname: string;
  /** avatar 的描述 */
  avatar: string;
  /** joinTime 的描述 */
  joinTime: Date;
  /** permissions 的描述 */
  permissions: {
    viewHealth: boolean; // 查看健康数据
    viewReports: boolean; // 查看分析报告
    viewMedical: boolean; // 查看就医记录
    manageSchedule: boolean; // 管理健康计划
    emergency: boolean; // 紧急联系人
  };
  /** healthSharingConfig 的描述 */
  healthSharingConfig: {
    metrics: string[]; // 共享的健康指标
    frequency: 'realtime' | 'daily' | 'weekly';
    autoShare: boolean; // 自动分享
    sensitiveData: boolean; // 敏感数据共享
  };
  /** status 的描述 */
  status: 'pending' | 'active' | 'blocked';
}

// 家庭健康报告
export interface IFamilyHealthReport {
  /** id 的描述 */
  id: string;
  /** familyId 的描述 */
  familyId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** members 的描述 */
  members: Array<{
    memberId: string;
    healthStatus: 'normal' | 'attention' | 'alert';
    metrics: {
      [key: string]: {
        value: number;
        trend: 'up' | 'down' | 'stable';
        alert?: string;
      };
    };
    recommendations: string[];
  }>;
  /** familyMetrics 的描述 */
  familyMetrics: {
    overallHealth: number;
    riskFactors: string[];
    improvements: string[];
  };
}

// 家庭健康提醒
export interface IFamilyHealthAlert {
  /** id 的描述 */
  id: string;
  /** familyId 的描述 */
  familyId: string;
  /** memberId 的描述 */
  memberId: string;
  /** type 的描述 */
  type: 'metric' | 'appointment' | 'medication' | 'emergency';
  /** priority 的描述 */
  priority: 'low' | 'medium' | 'high';
  /** message 的描述 */
  message: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** status 的描述 */
  status: 'new' | 'read' | 'handled';
  /** action 的描述 */
  action?: {
    type: string;
    data: any;
  };
}
