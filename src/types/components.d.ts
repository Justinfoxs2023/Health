/**
 * @fileoverview TS 文件 components.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace Components {
  // 家庭健康管理组件属性
  interface FamilyHealthManagerProps {
    familyId: string;
    onMemberUpdate: member: HealthFamilyMember  void;
    onError: error: Error  void;
  }

  // 奖励管理组件属性
  interface IRewardManagementProps {
    /** userId 的描述 */
      userId: string;
    /** onRewardClaim 的描述 */
      onRewardClaim: reward: HealthReward  void;
    onPointsUpdate: points: number  void;
  }

  // 通用组件属性
  interface IErrorBoundaryProps {
    /** children 的描述 */
      children: ReactReactNode;
    /** fallback 的描述 */
      fallback: ReactReactNode;
    /** onError 的描述 */
      onError: error: Error  void;
  }

  interface IFamilyTreeProps {
    /** data 的描述 */
      data: HealthDiseaseHistory;
    /** onMemberSelect 的描述 */
      onMemberSelect: memberId: string  void;
    highlightRisks: boolean;
  }

  interface IRiskIndicatorProps {
    /** level 的描述 */
      level: low  medium  high;
  }

  interface IHealthTimelineProps {
    /** data 的描述 */
      data: HealthTimelineEvent;
    /** onActionComplete 的描述 */
      onActionComplete: eventId: string  void;
  }

  interface IRiskDetailsDialogProps {
    /** open 的描述 */
      open: false | true;
    /** risk 的描述 */
      risk: HealthRiskAssessment  /** null 的描述 */
      /** null 的描述 */
      null;
    /** onClose 的描述 */
      onClose:   void;
  }
}
