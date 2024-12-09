import { ApiResponse } from '../types';

export interface Collection {
  id: string;
  type: '文章' | '问题';
  itemId: string;
  userId: string;
  createdAt: string;
}

export const getMyCollections = async (params: {
  type?: string;
}): Promise<ApiResponse<Collection[]>> => {
  // API 实现
  return { code: 200, data: [], message: 'success' };
}; 