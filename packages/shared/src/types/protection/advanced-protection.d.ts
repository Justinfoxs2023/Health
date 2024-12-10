// 智能客服
export interface AISupport {
  intelligentService: {
    chatbot: ChatbotConfig;
    voiceAssistant: VoiceConfig;
    smartRouting: RoutingConfig;
  };
  automatedResponse: {
    quickSolutions: SolutionConfig;
    intelligentFAQ: FAQConfig;
    predefinedScenarios: ScenarioConfig;
  };
  serviceAnalytics: AnalyticsConfig;
  performanceOptimization: OptimizationConfig;
}

// 响应优化
export interface ResponseOptimization {
  emergencyResponse: {
    rapidIntervention: InterventionConfig;
    priorityHandling: PriorityConfig;
    crisisManagement: CrisisConfig;
  };
  responseEfficiency: {
    processingOptimization: ProcessConfig;
    resourceScheduling: ScheduleConfig;
    loadBalancing: BalanceConfig;
  };
  qualityControl: QualityConfig;
  performanceMetrics: MetricConfig;
}

// 赔付流程
export interface CompensationProcess {
  claimProcessing: {
    automaticClaims: AutoClaimConfig;
    manualReview: ReviewConfig;
    appealHandling: AppealConfig;
  };
  compensationTracking: {
    claimStatus: StatusConfig;
    paymentProgress: ProgressConfig;
    documentManagement: DocumentConfig;
  };
  fraudPrevention: PreventionConfig;
  processAnalytics: AnalyticsConfig;
}

// 数据安全
export interface DataSecurity {
  advancedProtection: {
    encryptionSystem: EncryptionConfig;
    accessControl: AccessConfig;
    dataIsolation: IsolationConfig;
  };
  securityMonitoring: {
    realTimeDetection: DetectionConfig;
    threatPrevention: PreventionConfig;
    incidentResponse: ResponseConfig;
  };
  complianceManagement: ComplianceConfig;
  securityAuditing: AuditConfig;
} 