import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useNavigationManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole } = useSelector((state: RootState) => state.user);

  const handleNavigation = (path: string) => {
    // 权限检查
    if (requiresAuth(path) && !isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // 角色检查
    if (!hasPermission(path, userRole)) {
      navigate('/403');
      return;
    }

    // 数据预加载
    preloadPageData(path);

    // 执行导航
    navigate(path);
  };

  const preloadPageData = async (path: string) => {
    switch (path) {
      case '/dashboard':
        await Promise.all([
          store.dispatch(fetchHealthSummary()),
          store.dispatch(fetchUpcomingEvents()),
          store.dispatch(fetchRecentActivities()),
        ]);
        break;
      case '/member':
        await Promise.all([
          store.dispatch(fetchMemberProfile()),
          store.dispatch(fetchPrivileges()),
          store.dispatch(fetchBookings()),
        ]);
        break;
      // ... 其他页面的预加载逻辑
    }
  };

  return {
    handleNavigation,
    currentPath: location.pathname,
  };
}; 