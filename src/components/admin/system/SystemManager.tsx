import React, { useState } from 'react';

import {
  UserManager,
  RoleManager,
  PermissionManager,
  LogViewer,
  SystemMonitor,
  BackupManager,
} from './components';
import { useSystemManagement } from '../../../hooks/useSystemManagement';

export 
const SystemManager: React.FC = () => {
  const [activeModule, setActiveModule] = useState('users');
  const { data, operations, loading } = useSystemManagement();

  const renderModule = () => {
    switch (activeModule) {
      case 'users':
        return <UserManager users={data.users} onUserAction={operations.handleUserAction} />;
      case 'roles':
        return <RoleManager roles={data.roles} onRoleAction={operations.handleRoleAction} />;
      case 'permissions':
        return (
          <PermissionManager
            permissions={data.permissions}
            onPermissionAction={operations.handlePermissionAction}
          />
        );
      case 'logs':
        return <LogViewer logs={data.logs} onLogAction={operations.handleLogAction} />;
      case 'monitor':
        return (
          <SystemMonitor metrics={data.metrics} onMetricAction={operations.handleMetricAction} />
        );
      case 'backup':
        return (
          <BackupManager backups={data.backups} onBackupAction={operations.handleBackupAction} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="system-manager">
      <div className="module-nav">
        <button onClick={ => setActiveModuleusers}></button>
        <button onClick={ => setActiveModuleroles}></button>
        <button onClick={ => setActiveModulepermissions}></button>
        <button onClick={ => setActiveModulelogs}></button>
        <button onClick={ => setActiveModulemonitor}></button>
        <button onClick={ => setActiveModulebackup}></button>
      </div>

      <div className="module-content">{loading ? <div></div> : renderModule()}</div>
    </div>
  );
};
