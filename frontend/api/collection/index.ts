import { IApiResponse } from '../types';

export interface ICollection {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: '文章' | '问题';
  /** itemId 的描述 */
  itemId: string;
  /** userId 的描述 */
  userId: string;
  /** createdAt 的描述 */
  createdAt: string;
}

export const getMyCollections = async (params: {
  type?: string;
}): Promise<IApiResponse<ICollection[]>> => {
  // API 实现
  return { code: 200, data: [], message: 'success' };
};
