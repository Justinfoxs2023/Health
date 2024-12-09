import { ApiResponse } from '../types';

export interface UserProfile {
  id: string;
  avatar: string;
  name: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  dietaryRestrictions: string[];
  healthConditions: string[];
}

export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  // API 实现
  return { code: 200, data: {} as UserProfile, message: 'success' };
};

export const updateProfile = async (profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
  // API 实现
  return { code: 200, data: {} as UserProfile, message: 'success' };
};

export const uploadAvatar = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  // API 实现
  return { code: 200, data: { url: '' }, message: 'success' };
}; 