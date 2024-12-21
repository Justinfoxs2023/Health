import { IApiResponse } from '../types';

export interface INutritionist {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** avatar 的描述 */
  avatar: string;
  /** title 的描述 */
  title: string;
  /** hospital 的描述 */
  hospital: string;
  /** department 的描述 */
  department: string;
  /** specialty 的描述 */
  specialty: string[];
  /** introduction 的描述 */
  introduction: string;
  /** experience 的描述 */
  experience: number;
  /** rating 的描述 */
  rating: number;
  /** consultCount 的描述 */
  consultCount: number;
  /** onlinePrice 的描述 */
  onlinePrice: number;
  /** offlinePrice 的描述 */
  offlinePrice: number;
  /** availableTime 的描述 */
  availableTime: {
    date: string;
    times: string[];
  }[];
}

export interface IAppointment {
  /** id 的描述 */
  id: string;
  /** nutritionistId 的描述 */
  nutritionistId: string;
  /** date 的描述 */
  date: Date;
  /** type 的描述 */
  type: string;
  /** topic 的描述 */
  topic: string;
  /** duration 的描述 */
  duration: number;
  /** price 的描述 */
  price: number;
  /** status 的描述 */
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const getNutritionists = async (params: {
  keyword?: string;
  specialty?: string;
  page?: number;
  limit?: number;
}): Promise<IApiResponse<INutritionist[]>> => {
  // API 实现
  return { code: 200, data: [], message: 'success' };
};

export const getNutritionistDetails = async (id: string): Promise<IApiResponse<INutritionist>> => {
  // API 实现
  return { code: 200, data: {} as INutritionist, message: 'success' };
};

export const createAppointment = async (params: {
  nutritionistId: string;
  date: Date;
  type: string;
  topic: string;
  duration: number;
  price: number;
}): Promise<IApiResponse<IAppointment>> => {
  // API 实现
  return { code: 200, data: {} as IAppointment, message: 'success' };
};
