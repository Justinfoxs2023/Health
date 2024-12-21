/**
 * @fileoverview TS 文件 advanced-tasks.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 专业任务
export interface IProfessionalTasks {
  /** expertiseTasks 的描述 */
  expertiseTasks: {
    researchArticles: Task;
    caseStudies: Task;
    expertReviews: Task;
  };
  /** collaborativeTasks 的描述 */
  collaborativeTasks: {
    teamProjects: Project[];
    mentorshipPrograms: Program[];
    expertConsultations: Consultation[];
  };
  /** rewards 的描述 */
  rewards: ProfessionalReward[];
  /** expertiseProgress 的描述 */
  expertiseProgress: Progress;
}

// 创新任务
export interface InnovativeTasks {
  /** creativeProjects 的描述 */
  creativeProjects: {
    contentInnovations: Project;
    featureProposals: Proposal;
    communityInitiatives: Initiative;
  };
  /** researchTasks 的描述 */
  researchTasks: {
    trendAnalysis: Analysis[];
    userResearch: Research[];
    marketStudies: Study[];
  };
  /** innovationRewards 的描述 */
  innovationRewards: InnovationReward[];
  /** creativeProgress 的描述 */
  creativeProgress: Progress;
}

// 社区任务
export interface ICommunityTasks {
  /** supportTasks 的描述 */
  supportTasks: {
    memberGuidance: Task;
    problemSolving: Task;
    communityModeration: Task;
  };
  /** organizationalTasks 的描述 */
  organizationalTasks: {
    eventPlanning: Event[];
    communityProjects: Project[];
    qualityControl: Task[];
  };
  /** communityRewards 的描述 */
  communityRewards: CommunityReward[];
  /** influenceMetrics 的描述 */
  influenceMetrics: Metric[];
}

// 高级认证
export interface IAdvancedCertification {
  /** expertiseStandards 的描述 */
  expertiseStandards: {
    knowledgeDepth: Evaluation;
    practicalExperience: Evaluation;
    professionalAchievements: Achievement;
  };
  /** contributionStandards 的描述 */
  contributionStandards: {
    contentQuality: QualityMetric;
    communityImpact: ImpactMetric;
    innovationLevel: InnovationMetric;
  };
  /** certificationPath 的描述 */
  certificationPath: Path;
  /** developmentPlan 的描述 */
  developmentPlan: Plan;
}
