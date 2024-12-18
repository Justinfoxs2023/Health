import {
  IApiResponse,
  INotificationSettings,
  IExportDataParams,
  IExportDataResponse,
} from './types';
expor
t const getNotificationSettings = async (): Promise<IApiResponse<INotificationSettings>> => {
  const response = await fetch('/api/user/notification-settings');
  return response.json();
};

export const updateNotificationSettings = async (
  settings: Partial<INotificationSettings>,
): Promise<IApiResponse<INotificationSettings>> => {
  const response = await fetch('/api/user/notification-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  return response.json();
};

export const exportUserData = async (
  params: IExportDataParams,
): Promise<IApiResponse<IExportDataResponse>> => {
  const response = await fetch('/api/user/export-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
};

export interface IDeleteAccountParams {
  /** password 的描述 */
  password: string;
  /** reason 的描述 */
  reason?: string;
  /** confirmation 的描述 */
  confirmation: string;
}

export const deleteAccount = async (params: IDeleteAccountParams): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/user/delete-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
};

export interface IFeedbackParams {
  /** type 的描述 */
  type: string;
  /** content 的描述 */
  content: string;
  /** images 的描述 */
  images?: string[];
  /** contact 的描述 */
  contact?: string;
}

export const submitFeedback = async (params: IFeedbackParams): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/user/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
};
