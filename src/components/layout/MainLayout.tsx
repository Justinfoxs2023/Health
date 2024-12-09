export const MainLayout: React.FC = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// 头部组件
const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="logo">
        <img src="/logo.svg" alt="健康管理" />
      </div>
      <Navigation />
      <div className="header-right">
        <NotificationCenter />
        <UserProfile />
      </div>
    </header>
  );
};

// 侧边栏组件
const Sidebar: React.FC = () => {
  return (
    <aside className="main-sidebar">
      <MainMenu />
      <QuickAccess />
    </aside>
  );
}; 