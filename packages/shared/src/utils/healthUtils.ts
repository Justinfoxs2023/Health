export const getRiskLevelText = (level: 'low' | 'medium' | 'high'): string => {
  const texts = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险'
  };
  return texts[level];
};

export const generatePreventiveTimeline = (
  risks: Health.RiskAssessment[]
): Health.TimelineEvent[] => {
  return risks.flatMap(risk =>
    risk.preventiveMeasures.map(measure => ({
      id: `${risk.disease}-${measure.action}`,
      date: measure.timeline,
      action: measure.action,
      status: 'pending'
    }))
  );
}; 