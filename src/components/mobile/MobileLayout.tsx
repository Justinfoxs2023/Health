export const MobileLayout: React.FC = () => {
  return (
    <div className="mobile-layout">
      <div className="mobile-content">
        {children}
      </div>
      
      <BottomNavigation 
        activeTab={currentTab}
        onTabChange={handleTabChange}
        items={[
          { key: 'home', icon: <HomeIcon />, label: '首页' },
          { key: 'services', icon: <ServiceIcon />, label: '服务' },
          { key: 'community', icon: <CommunityIcon />, label: '社区' },
          { key: 'profile', icon: <ProfileIcon />, label: '我的' }
        ]}
      />
    </div>
  );
}; 