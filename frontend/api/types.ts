export interface NotificationSettings {
  appointmentReminder: boolean;
  consultationMessage: boolean;
  healthAlert: boolean;
  dietPlanUpdate: boolean;
  weeklyReport: boolean;
  systemNotice: boolean;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  pageSize: number;
}

export type ExportDataType = 'all' | 'health' | 'diet' | 'consultation';

export interface ExportDataParams {
  type: ExportDataType;
}

export interface ExportDataResponse {
  downloadUrl: string;
  expiresAt: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
}

export interface NavigationProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route: {
    params: any;
  };
} 