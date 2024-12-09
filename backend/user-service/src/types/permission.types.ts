export interface Permission {
  resource: Resource;
  actions: string[];
}

export type Resource = 
  | 'users'
  | 'profiles'
  | 'health_records'
  | 'settings';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
} 