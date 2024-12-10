export const CommunitySpace: React.FC = () => {
  return (
    <div className="community-space">
      <div className="activity-section">
        <h2>社区动态</h2>
        <ActivityWall 
          activities={communityActivities}
          onActivityInteract={handleActivityInteract}
        />
      </div>

      <div className="challenge-section">
        <h2>健康挑战</h2>
        <ChallengeBoard 
          challenges={activeChallenges}
          onChallengeJoin={handleChallengeJoin}
        />
      </div>

      <div className="achievement-section">
        <h2>成就中心</h2>
        <AchievementGallery 
          achievements={userAchievements}
          onAchievementClick={handleAchievementClick}
        />
      </div>
    </div>
  );
}; 