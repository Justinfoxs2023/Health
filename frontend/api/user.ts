import { ApiResponse, NotificationSettings, ExportDataParams, ExportDataResponse } from './types';

export const getNotificationSettings = async (): Promise<ApiResponse<NotificationSettings>> => {
  const response = await fetch('/api/user/notification-settings');
  return response.json();
};

export const updateNotificationSettings = async (settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> => {
  const response = await fetch('/api/user/notification-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
  return response.json();
};

export const exportUserData = async (params: ExportDataParams): Promise<ApiResponse<ExportDataResponse>> => {
  const response = await fetch('/api/user/export-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  return response.json();
};

export interface DeleteAccountParams {
  password: string;
  reason?: string;
  confirmation: string;
}

export const deleteAccount = async (params: DeleteAccountParams): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/user/delete-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  return response.json();
};

export interface FeedbackParams {
  type: string;
  content: string;
  images?: string[];
  contact?: string;
}

export const submitFeedback = async (params: FeedbackParams): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/user/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  return response.json();
}; 