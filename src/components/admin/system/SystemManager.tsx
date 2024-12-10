import React, { useState } from 'react';
import {
  UserManager,
  RoleManager,
  PermissionManager,
  LogViewer,
  SystemMonitor,
  BackupManager
} from './components';
import { useSystemManagement } from '../../../hooks/useSystemManagement';

export const SystemManager: React.FC = () => {
  const [activeModule, setActiveModule] = useState('users');
  const { data, operations, loading } = useSystemManagement();

  const renderModule = () => {
    switch (activeModule) {
      case 'users':
        return (
          <UserManager 
            users={data.users}
            onUserAction={operations.handleUserAction}
          />
        );
      case 'roles':
        return (
          <RoleManager 
            roles={data.roles}
            onRoleAction={operations.handleRoleAction}
          />
        );
      case 'permissions':
        return (
          <PermissionManager 
            permissions={data.permissions}
            onPermissionAction={operations.handlePermissionAction}
          />
        );
      case 'logs':
        return (
          <LogViewer 
            logs={data.logs}
            onLogAction={operations.handleLogAction}
          />
        );
      case 'monitor':
        return (
          <SystemMonitor 
            metrics={data.metrics}
            onMetricAction={operations.handleMetricAction}
          />
        );
      case 'backup':
        return (
          <BackupManager 
            backups={data.backups}
            onBackupAction={operations.handleBackupAction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="system-manager">
      <div className="module-nav">
        <button onClick={() => setActiveModule('users')}>用户管理</button>
        <button onClick={() => setActiveModule('roles')}>角色管理</button>
        <button onClick={() => setActiveModule('permissions')}>权限管理</button>
        <button onClick={() => setActiveModule('logs')}>日志查看</button>
        <button onClick={() => setActiveModule('monitor')}>系统监控</button>
        <button onClick={() => setActiveModule('backup')}>备份管理</button>
      </div>

      <div className="module-content">
        {loading ? <div>加载中...</div> : renderModule()}
      </div>
    </div>
  );
}; 