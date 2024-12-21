import { IApiResponse } from '../types';

export interface IUserProfile {
  /** id 的描述 */
  id: string;
  /** avatar 的描述 */
  avatar: string;
  /** name 的描述 */
  name: string;
  /** gender 的描述 */
  gender: string;
  /** age 的描述 */
  age: number;
  /** height 的描述 */
  height: number;
  /** weight 的描述 */
  weight: number;
  /** activityLevel 的描述 */
  activityLevel: string;
  /** dietaryRestrictions 的描述 */
  dietaryRestrictions: string[];
  /** healthConditions 的描述 */
  healthConditions: string[];
}

export const getUserProfile = async (): Promise<IApiResponse<IUserProfile>> => {
  // API 实现
  return { code: 200, data: {} as IUserProfile, message: 'success' };
};

export const updateProfile = async (
  profile: Partial<IUserProfile>,
): Promise<IApiResponse<IUserProfile>> => {
  // API 实现
  return { code: 200, data: {} as IUserProfile, message: 'success' };
};

export const uploadAvatar = async (file: File): Promise<IApiResponse<{ url: string }>> => {
  // API 实现
  return { code: 200, data: { url: '' }, message: 'success' };
};
