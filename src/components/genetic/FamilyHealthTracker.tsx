import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Chip
} from '@mui/material';
import { FamilyTree } from '../common/FamilyTree';
import { RiskIndicator } from '../common/RiskIndicator';
import { HealthTimeline } from '../common/HealthTimeline';
import { RiskDetailsDialog } from './RiskDetailsDialog';
import { getRiskLevelText, generatePreventiveTimeline } from '../../utils/healthUtils';

interface FamilyHealthTrackerProps {
  userId: string;
  familyHistory: Family.DiseaseHistory[];
  riskAssessment: Family.DiseaseRisk[];
  onUpdateHistory: (history: Family.DiseaseHistory) => Promise<void>;
}

export const FamilyHealthTracker: React.FC<FamilyHealthTrackerProps> = ({
  userId,
  familyHistory,
  riskAssessment,
  onUpdateHistory
}) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Family.DiseaseRisk | null>(null);

  const handleActionComplete = async (eventId: string) => {
    // 实现完成动作的逻辑
  };

  return (
    <Box className="family-health-tracker">
      {/* 家族病史可视化 */}
      <Card className="family-tree-section">
        <Typography variant="h6">家族健康图谱</Typography>
        <FamilyTree
          data={familyHistory}
          onMemberSelect={setSelectedMember}
          highlightRisks={true}
        />
      </Card>

      {/* 遗传风险评估 */}
      <Card className="risk-assessment">
        <Typography variant="h6">遗传风险评估</Typography>
        <Grid container spacing={2}>
          {riskAssessment.map(risk => (
            <Grid item xs={12} md={4} key={risk.disease}>
              <RiskCard
                risk={risk}
                onViewDetails={() => setShowRiskDetails(true)}
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* 预防建议时间轴 */}
      <Card className="preventive-timeline">
        <Typography variant="h6">预防建议时间轴</Typography>
        <HealthTimeline
          data={generatePreventiveTimeline(riskAssessment)}
          onActionComplete={handleActionComplete}
        />
      </Card>

      {/* 风险详情对话框 */}
      <RiskDetailsDialog
        open={showRiskDetails}
        risk={selectedRisk}
        onClose={() => setShowRiskDetails(false)}
      />
    </Box>
  );
};

// 风险卡片组件
const RiskCard: React.FC<{
  risk: Family.DiseaseRisk;
  onViewDetails: () => void;
}> = ({ risk, onViewDetails }) => {
  return (
    <Card className="risk-card">
      <Typography variant="subtitle1">{risk.disease}</Typography>
      <Box className="risk-level">
        <RiskIndicator level={risk.riskLevel} />
        <Typography variant="body2">
          风险等级: {getRiskLevelText(risk.riskLevel)}
        </Typography>
      </Box>
      <Box className="risk-factors">
        {risk.contributingFactors.map(factor => (
          <Chip key={factor} label={factor} size="small" />
        ))}
      </Box>
      <Button
        variant="outlined"
        size="small"
        onClick={onViewDetails}
      >
        查看详情
      </Button>
    </Card>
  );
}; 