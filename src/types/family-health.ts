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
    relationshipType: spouse  child  parent  grandparent  other;
  nickname: string;
  avatar: string;
  joinTime: Date;
  permissions: {
    viewHealth: boolean;  
    viewReports: boolean;  
    viewMedical: boolean;  
    manageSchedule: boolean;  
    emergency: boolean;  
  };
  healthSharingConfig: {
    metrics: string[]; // 共享的健康指标
    frequency: 'realtime' | 'daily' | 'weekly';
    autoShare: boolean; // 自动分享
    sensitiveData: boolean; // 敏感数据共享
  };
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
    members: Array{
    memberId: string;
    healthStatus: normal  attention  alert;
    metrics: {
      key: string: {
        value: number;
        trend: up  down  stable;
        alert: string;
      };
    };
    recommendations: string[];
  }>;
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
    type: metric  appointment  medication  emergency;
  priority: low  medium  high;
  message: string;
  timestamp: Date;
  status: new  read  handled;
  action: {
    type: string;
    data: any;
  };
}
