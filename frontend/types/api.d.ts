/**
 * @fileoverview TS 文件 api.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '../../api/user' {
  import { ApiResponse, NotificationSettings, PrivacySettings } from './types';

  export function getNotificationSettings(): Promise<ApiResponse<NotificationSettings>>;
  export function updateNotificationSettings(
    settings: Partial<NotificationSettings>,
  ): Promise<ApiResponse<NotificationSettings>>;
  export function getPrivacySettings(): Promise<ApiResponse<PrivacySettings>>;
  export function updatePrivacySettings(
    settings: Partial<PrivacySettings>,
  ): Promise<ApiResponse<PrivacySettings>>;
}

declare module '../../api/types' {
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }

  export interface NotificationSettings {
    appointmentReminder: boolean;
    consultationMessage: boolean;
    healthAlert: boolean;
    dietPlanUpdate: boolean;
    weeklyReport: boolean;
    systemNotice: boolean;
  }

  export interface PrivacySettings {
    profileVisibility: boolean;
    healthDataSharing: boolean;
    dietPlanSharing: boolean;
    activityTracking: boolean;
    locationServices: boolean;
  }
}

declare module '../../components' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  export interface LoadingSpinnerProps {
    style?: ViewStyle;
  }

  export const LoadingSpinner: ComponentType<LoadingSpinnerProps>;
}
