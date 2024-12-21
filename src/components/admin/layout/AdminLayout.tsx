import React from 'react';

import { AdminHeader, AdminSidebar, AdminFooter, Breadcrumb } from './components';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

export const AdminLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user, permissions } = useAdminAuth();

  return (
    <div className="admin-layout">
      <AdminHeader user={user} />

      <div className="admin-container">
        <AdminSidebar permissions={permissions} />

        <div className="admin-content">
          <Breadcrumb />
          <div className="contentwrapper">{children}</div>
        </div>
      </div>

      <AdminFooter />
    </div>
  );
};
