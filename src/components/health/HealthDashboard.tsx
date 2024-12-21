/**
 * @fileoverview TSX 文件 HealthDashboard.tsx 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const HealthDashboard: React.FC<{ levelSystem: IEnhancedLevelSystem }> = ({
  levelSystem,
}) => {
  return (
    <Grid container spacing={3}>
      {/* 基础健康追踪 - 1级解锁 */}
      <Grid item xs={12}>
        <FeatureGatekeeper
          feature={{
            id: 'basic_tracking',
            name: '基础健康追踪',
            moduleType: 'health_tracking',
            minLevel: 1,
            depth: 'basic',
            description: '记录基本健康数据',
          }}
          levelSystem={levelSystem}
        >
          <BasicHealthTracking />
        </FeatureGatekeeper>
      </Grid>

      {/* 高级数据分析 - 15级解锁 */}
      <Grid item xs={12} md={6}>
        <FeatureGatekeeper
          feature={{
            id: 'advanced_analysis',
            name: '高级数据分析',
            moduleType: 'data_analysis',
            minLevel: 15,
            depth: 'advanced',
            description: '深入分析健康趋势',
            requirements: {
              points: 5000,
              achievements: ['health_master'],
            },
          }}
          levelSystem={levelSystem}
        >
          <AdvancedAnalysis />
        </FeatureGatekeeper>
      </Grid>
    </Grid>
  );
};
