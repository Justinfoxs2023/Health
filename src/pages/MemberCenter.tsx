export const MemberCenter: React.FC = () => {
  return (
    <div className="member-center">
      <div className="member-info">
        <MemberCard 
          memberInfo={currentMember}
          privileges={memberPrivileges}
        />
      </div>

      <div className="privilege-section">
        <h2>我的权益</h2>
        <PrivilegeGrid 
          privileges={availablePrivileges}
          onPrivilegeSelect={handlePrivilegeSelect}
        />
      </div>

      <div className="booking-section">
        <h2>预约服务</h2>
        <BookingCalendar 
          availableSlots={bookingSlots}
          onSlotSelect={handleSlotSelect}
        />
      </div>

      <div className="recommendation-section">
        <h2>为您推荐</h2>
        <RecommendationPanel 
          recommendations={personalizedRecommendations}
          onRecommendationClick={handleRecommendationClick}
        />
      </div>
    </div>
  );
}; 