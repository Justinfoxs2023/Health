import React, { useEffect, useState } from 'react';

import {
  TeamHeader,
  MembersSection,
  PerformanceSection,
  ChallengesSection,
  LeaderboardSection,
  EventsSection,
  TeamChat,
} from './sections';
import { LoadingSpinner, ErrorMessage } from '../../common';
import { useParams } from 'react-router-dom';
import { useTeamData } from '../../../hooks/useTeamData';

export c
onst TeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data, loading, error } = useTeamData(teamId);
  const [config, setConfig] = useState<TeamPageConfig>();

  useEffect(() => {
    // 加载页面配置
    const loadConfig = async () => {
      const pageConfig = await getTeamPageConfig(teamId);
      setConfig(pageConfig);
    };
    loadConfig();
  }, [teamId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || !config) return null;

  return (
    <div className="team-page">
      <TeamHeader team={data.team} config={config.sections.header} />

      <div className="team-content">
        <div className="main-content">
          <MembersSection members={data.members} config={config.sections.members} />

          <PerformanceSection performance={data.performance} config={config.sections.performance} />

          <ChallengesSection challenges={data.challenges} config={config.sections.challenges} />
        </div>

        <div className="side-content">
          <LeaderboardSection leaderboard={data.leaderboard} config={config.sections.leaderboard} />

          <EventsSection events={data.events} config={config.sections.events} />
        </div>
      </div>

      <TeamChat chatData={data.chat} config={config.collaboration.chat} />
    </div>
  );
};
