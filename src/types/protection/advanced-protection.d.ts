/**
 * @fileoverview TS 文件 advanced-protection.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 智能客服
export interface IAISupport {
  /** intelligentService 的描述 */
  intelligentService: {
    chatbot: ChatbotConfig;
    voiceAssistant: VoiceConfig;
    smartRouting: RoutingConfig;
  };
  /** automatedResponse 的描述 */
  automatedResponse: {
    quickSolutions: SolutionConfig;
    intelligentFAQ: FAQConfig;
    predefinedScenarios: ScenarioConfig;
  };
  /** serviceAnalytics 的描述 */
  serviceAnalytics: AnalyticsConfig;
  /** performanceOptimization 的描述 */
  performanceOptimization: OptimizationConfig;
}

// 响应优化
export interface IResponseOptimization {
  /** emergencyResponse 的描述 */
  emergencyResponse: {
    rapidIntervention: InterventionConfig;
    priorityHandling: PriorityConfig;
    crisisManagement: CrisisConfig;
  };
  /** responseEfficiency 的描述 */
  responseEfficiency: {
    processingOptimization: ProcessConfig;
    resourceScheduling: ScheduleConfig;
    loadBalancing: BalanceConfig;
  };
  /** qualityControl 的描述 */
  qualityControl: QualityConfig;
  /** performanceMetrics 的描述 */
  performanceMetrics: MetricConfig;
}

// 赔付流程
export interface ICompensationProcess {
  /** claimProcessing 的描述 */
  claimProcessing: {
    automaticClaims: AutoClaimConfig;
    manualReview: ReviewConfig;
    appealHandling: AppealConfig;
  };
  /** compensationTracking 的描述 */
  compensationTracking: {
    claimStatus: StatusConfig;
    paymentProgress: ProgressConfig;
    documentManagement: DocumentConfig;
  };
  /** fraudPrevention 的描述 */
  fraudPrevention: PreventionConfig;
  /** processAnalytics 的描述 */
  processAnalytics: AnalyticsConfig;
}

// 数据安全
export interface IDataSecurity {
  /** advancedProtection 的描述 */
  advancedProtection: {
    encryptionSystem: EncryptionConfig;
    accessControl: AccessConfig;
    dataIsolation: IsolationConfig;
  };
  /** securityMonitoring 的描述 */
  securityMonitoring: {
    realTimeDetection: DetectionConfig;
    threatPrevention: PreventionConfig;
    incidentResponse: ResponseConfig;
  };
  /** complianceManagement 的描述 */
  complianceManagement: ComplianceConfig;
  /** securityAuditing 的描述 */
  securityAuditing: AuditConfig;
}
