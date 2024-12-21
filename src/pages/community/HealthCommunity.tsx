import { useEffect } from 'react';

import styled from 'styled-components';
import { ExperienceSharing } from './components/ExperienceSharing';
import { ExpertColumns } from './components/ExpertColumns';
import { HealthChallenges } from './components/HealthChallenges';
import { HealthMoments } from './components/HealthMoments';
import { TeamCompetitions } from './components/TeamCompetitions';

const CommunityContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MainFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const HealthCommunity: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, challenges, experts } = useSelector((state: RootState) => state.community);

  useEffect(() => {
    dispatch(fetchCommunityData());
  }, [dispatch]);

  return (
    <CommunityContainer>
      <MainFeed>
        <HealthMoments
          posts={posts}
          onPostCreate={handlePostCreate}
          onPostInteract={handlePostInteract}
        />

        <ExperienceSharing
          experiences={posts.filter(p => p.type === 'experience')}
          onShare={handleExperienceShare}
        />
      </MainFeed>

      <SideContent>
        <ExpertColumns
          experts={experts}
          onFollow={handleExpertFollow}
          onConsult={handleExpertConsult}
        />

        <HealthChallenges
          challenges={challenges}
          onJoinChallenge={handleJoinChallenge}
          onCreateChallenge={handleCreateChallenge}
        />

        <TeamCompetitions
          competitions={challenges.filter(c => c.type === 'team')}
          onJoinTeam={handleJoinTeam}
          onCreateTeam={handleCreateTeam}
        />
      </SideContent>
    </CommunityContainer>
  );
};
