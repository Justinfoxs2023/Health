import { useEffect } from 'react';

import styled from 'styled-components';
import { ActivityTracker } from './components/ActivityTracker';
import { HealthPrediction } from './components/HealthPrediction';
import { PersonalizedReports } from './components/PersonalizedReports';
import { RiskAssessment } from './components/RiskAssessment';
import { SleepAnalysis } from './components/SleepAnalysis';
import { VitalsMonitor } from './components/VitalsMonitor';
import { useDispatch, useSelector } from 'react-redux';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const DashboardSection = styled.section`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing(2)};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const HealthDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { healthData, loading } = useSelector((state: RootState) => state.health);

  useEffect(() => {
    dispatch(fetchHealthData());
    const interval = setInterval(() => {
      dispatch(updateRealTimeData());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <DashboardContainer>
      {/* 实时生命体征监测 */}
      <DashboardSection>
        <VitalsMonitor data={healthData.vitals} onAlert={handleVitalsAlert} />
      </DashboardSection>

      {/* 活动量追踪 */}
      <DashboardSection>
        <ActivityTracker data={healthData.activity} goals={healthData.goals} />
      </DashboardSection>

      {/* 睡眠质量分析 */}
      <DashboardSection>
        <SleepAnalysis data={healthData.sleep} recommendations={healthData.sleepRecommendations} />
      </DashboardSection>

      {/* AI健康分析 */}
      <DashboardSection>
        <HealthPrediction trends={healthData.trends} predictions={healthData.predictions} />
        <RiskAssessment risks={healthData.risks} suggestions={healthData.suggestions} />
      </DashboardSection>

      {/* 个性化报告 */}
      <DashboardSection>
        <PersonalizedReports
          dailyReport={healthData.dailyReport}
          weeklyAnalysis={healthData.weeklyAnalysis}
          monthlyTrends={healthData.monthlyTrends}
        />
      </DashboardSection>
    </DashboardContainer>
  );
};
