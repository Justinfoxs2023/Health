import { RoleConfigMap } from '../types/role';

export const RoleConfig: RoleConfigMap = {
  USER: {
    code: 'USER',
    permissions: [
      'VIEW_PROFILE',
      'EDIT_PROFILE',
      'VIEW_HEALTH_DATA',
      'RECORD_HEALTH_DATA',
      'VIEW_REPORTS',
      'JOIN_COMMUNITY'
    ]
  },
  DOCTOR: {
    code: 'DOCTOR',
    permissions: [
      'VIEW_PATIENT_DATA',
      'WRITE_PRESCRIPTION',
      'PROVIDE_CONSULTATION',
      'MANAGE_HEALTH_PLAN',
      'ACCESS_MEDICAL_RECORDS'
    ]
  },
  HEALTH_ADVISOR: {
    code: 'HEALTH_ADVISOR',
    permissions: [
      'VIEW_CLIENT_DATA',
      'CREATE_HEALTH_PLAN',
      'PROVIDE_GUIDANCE',
      'MONITOR_PROGRESS'
    ]
  },
  ADMIN: {
    code: 'ADMIN',
    permissions: [
      'MANAGE_USERS',
      'MANAGE_ROLES',
      'MANAGE_PERMISSIONS',
      'VIEW_SYSTEM_LOGS',
      'MANAGE_CONTENT'
    ]
  }
}; 