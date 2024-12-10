// 家庭成员类型
export interface FamilyMember {
  id: string;
  userId: string;
  relationshipType: 'spouse' | 'child' | 'parent' | 'grandparent' | 'other';
  nickname: string;
  avatar: string;
  joinTime: Date;
  permissions: {
    viewHealth: boolean;      // 查看健康数据
    viewReports: boolean;     // 查看分析报告
    viewMedical: boolean;     // 查看就医记录
    manageSchedule: boolean;  // 管理健康计划
    emergency: boolean;       // 紧急联系人
  };
  healthSharingConfig: {
    metrics: string[];        // 共享的健康指标
    frequency: 'realtime' | 'daily' | 'weekly';
    autoShare: boolean;       // 自动分享
    sensitiveData: boolean;   // 敏感数据共享
  };
  status: 'pending' | 'active' | 'blocked';
}

// 家庭健康报告
export interface FamilyHealthReport {
  id: string;
  familyId: string;
  timestamp: Date;
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
  familyMetrics: {
    overallHealth: number;
    riskFactors: string[];
    improvements: string[];
  };
}

// 家庭健康提醒
export interface FamilyHealthAlert {
  id: string;
  familyId: string;
  memberId: string;
  type: 'metric' | 'appointment' | 'medication' | 'emergency';
  priority: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  status: 'new' | 'read' | 'handled';
  action?: {
    type: string;
    data: any;
  };
} 