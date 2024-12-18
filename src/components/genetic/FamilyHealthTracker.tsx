import React, { useState } from 'react';

import { Box, Card, Grid, Typography, Button, Chip } from '@mui/material';
import { FamilyTree } from '../common/FamilyTree';
import { HealthTimeline } from '../common/HealthTimeline';
import { RiskDetailsDialog } from './RiskDetailsDialog';
import { RiskIndicator } from '../common/RiskIndicator';
import { getRiskLevelText, generatePreventiveTimeline } from '../../utils/healthUtils';

interface IFamilyHealthTrackerProps {
  /** userId 的描述 */
    userId: string;
  /** familyHistory 的描述 */
    familyHistory: FamilyDiseaseHistory;
  /** riskAssessment 的描述 */
    riskAssessment: FamilyDiseaseRisk;
  /** onUpdateHistory 的描述 */
    onUpdateHistory: history: FamilyDiseaseHistory  Promisevoid;
}

export const FamilyHealthTracker: React.FC<IFamilyHealthTrackerProps> = ({
  userId,
  familyHistory,
  riskAssessment,
  onUpdateHistory,
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
        <Typography variant="h6"></Typography>
        <FamilyTree data={familyHistory} onMemberSelect={setSelectedMember} highlightRisks={true} />
      </Card>

      {/* 遗传风险评估 */}
      <Card className="risk-assessment">
        <Typography variant="h6"></Typography>
        <Grid container spacing={2}>
          {riskAssessment.map(risk => (
            <Grid item xs={12} md={4} key={risk.disease}>
              <RiskCard risk={risk} onViewDetails={() => setShowRiskDetails(true)} />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* 预防建议时间轴 */}
      <Card className="preventive-timeline">
        <Typography variant="h6"></Typography>
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
      <Typography variant="subtitle1">{riskdisease}</Typography>
      <Box className="risk-level">
        <RiskIndicator level={risk.riskLevel} />
        <Typography variant="body2"> {getRiskLevelTextriskriskLevel}</Typography>
      </Box>
      <Box className="risk-factors">
        {risk.contributingFactors.map(factor => (
          <Chip key={factor} label={factor} size="small" />
        ))}
      </Box>
      <Button variant="outlined" size="small" onClick={onViewDetails}>
        
      </Button>
    </Card>
  );
};
