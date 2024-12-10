declare namespace Components {
  // 家庭健康管理组件属性
  interface FamilyHealthManagerProps {
    familyId?: string;
    onMemberUpdate?: (member: Health.FamilyMember) => void;
    onError?: (error: Error) => void;
  }

  // 奖励管理组件属性
  interface RewardManagementProps {
    userId: string;
    onRewardClaim?: (reward: Health.Reward) => void;
    onPointsUpdate?: (points: number) => void;
  }

  // 通用组件属性
  interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error) => void;
  }

  interface FamilyTreeProps {
    data: Health.DiseaseHistory[];
    onMemberSelect: (memberId: string) => void;
    highlightRisks?: boolean;
  }

  interface RiskIndicatorProps {
    level: 'low' | 'medium' | 'high';
  }

  interface HealthTimelineProps {
    data: Health.TimelineEvent[];
    onActionComplete: (eventId: string) => void;
  }

  interface RiskDetailsDialogProps {
    open: boolean;
    risk: Health.RiskAssessment | null;
    onClose: () => void;
  }
} 