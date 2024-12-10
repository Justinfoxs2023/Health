import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ProfileHeader,
  HealthOverview,
  StatsSection,
  ActivityFeed,
  GoalsSection,
  AchievementsSection 
} from './sections';
import { useProfileData } from '../../../hooks/useProfileData';
import { LoadingSpinner, ErrorMessage } from '../../common';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data, loading, error } = useProfileData(userId);
  const [config, setConfig] = useState<ProfilePageConfig>();

  useEffect(() => {
    // 加载页面配置
    const loadConfig = async () => {
      const pageConfig = await getProfilePageConfig(userId);
      setConfig(pageConfig);
    };
    loadConfig();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || !config) return null;

  return (
    <div className="profile-page">
      <ProfileHeader 
        user={data.user}
        config={config.sections.header}
      />
      
      <div className="profile-content">
        <HealthOverview 
          data={data.health}
          config={config.sections.overview}
        />
        
        <div className="stats-activities-container">
          <StatsSection 
            stats={data.stats}
            config={config.sections.stats}
          />
          <ActivityFeed 
            activities={data.activities}
            config={config.sections.activities}
          />
        </div>
        
        <div className="goals-achievements-container">
          <GoalsSection 
            goals={data.goals}
            config={config.sections.goals}
          />
          <AchievementsSection 
            achievements={data.achievements}
            config={config.sections.achievements}
          />
        </div>
      </div>
    </div>
  );
}; 