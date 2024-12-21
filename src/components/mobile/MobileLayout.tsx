/**
 * @fileoverview TSX 文件 MobileLayout.tsx 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const MobileLayout: React.FC = () => {
  return (
    <div className="mobile-layout">
      <div className="mobilecontent">{children}</div>

      <BottomNavigation
        activeTab={currentTab}
        onTabChange={handleTabChange}
        items={[
          { key: 'home', icon: <HomeIcon />, label: '首页' },
          { key: 'services', icon: <ServiceIcon />, label: '服务' },
          { key: 'community', icon: <CommunityIcon />, label: '社区' },
          { key: 'profile', icon: <ProfileIcon />, label: '我的' },
        ]}
      />
    </div>
  );
};
