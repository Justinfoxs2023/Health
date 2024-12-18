/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface INotificationSettings {
  /** appointmentReminder 的描述 */
  appointmentReminder: boolean;
  /** consultationMessage 的描述 */
  consultationMessage: boolean;
  /** healthAlert 的描述 */
  healthAlert: boolean;
  /** dietPlanUpdate 的描述 */
  dietPlanUpdate: boolean;
  /** weeklyReport 的描述 */
  weeklyReport: boolean;
  /** systemNotice 的描述 */
  systemNotice: boolean;
}

export interface IApiResponse<T> {
  /** code 的描述 */
  code: number;
  /** data 的描述 */
  data: T;
  /** message 的描述 */
  message: string;
}

export interface IPaginatedResponse<T> extends IApiResponse<T> {
  /** total 的描述 */
  total: number;
  /** page 的描述 */
  page: number;
  /** pageSize 的描述 */
  pageSize: number;
}

export type ExportDataType = 'all' | 'health' | 'diet' | 'consultation';

export interface IExportDataParams {
  /** type 的描述 */
  type: ExportDataType;
}

export interface IExportDataResponse {
  /** downloadUrl 的描述 */
  downloadUrl: string;
  /** expiresAt 的描述 */
  expiresAt: string;
}

export interface IQueryParams {
  /** page 的描述 */
  page?: number;
  /** limit 的描述 */
  limit?: number;
  /** keyword 的描述 */
  keyword?: string;
  /** category 的描述 */
  category?: string;
}

export interface INavigationProps {
  /** navigation 的描述 */
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  /** route 的描述 */
  route: {
    params: any;
  };
}
