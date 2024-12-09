export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'nin';
  value: any;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPermissions {
  userId: string;
  roles: string[];
  permissions: string[];
  customPermissions?: Permission[];
} 