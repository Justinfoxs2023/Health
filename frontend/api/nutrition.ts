import { IApiResponse } from '../types/api';

export interface INutritionQuestion {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** category 的描述 */
  category: string;
  /** tags 的描述 */
  tags: string[];
  /** images 的描述 */
  images: string[];
  /** status 的描述 */
  status: string;
  /** userId 的描述 */
  userId: string;
  /** createdAt 的描述 */
  createdAt: string;
  /** answers 的描述 */
  answers: IAnswer[];
}

export interface IAnswer {
  /** _id 的描述 */
  _id: string;
  /** content 的描述 */
  content: string;
  /** userId 的描述 */
  userId: string;
  /** likes 的描述 */
  likes: number;
  /** isAccepted 的描述 */
  isAccepted: boolean;
  /** createdAt 的描述 */
  createdAt: string;
}

export interface INutritionArticle {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** category 的描述 */
  category: string;
  /** author 的描述 */
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
  };
  /** coverImage 的描述 */
  coverImage: string;
  /** summary 的描述 */
  summary: string;
  /** likes 的描述 */
  likes: number;
  /** views 的描述 */
  views: number;
  /** createdAt 的描述 */
  createdAt: string;
}

export const getNutritionQuestions = async (params?: {
  category?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<IApiResponse<INutritionQuestion[]>> => {
  // API implementation
  return {} as any;
};

export const getQuestionDetails = async (id: string): Promise<IApiResponse<INutritionQuestion>> => {
  // API implementation
  return {} as any;
};

export const createQuestion = async (data: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  isPrivate: boolean;
}): Promise<IApiResponse<INutritionQuestion>> => {
  // API implementation
  return {} as any;
};

export const getNutritionArticles = async (params?: {
  category?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<IApiResponse<INutritionArticle[]>> => {
  // API implementation
  return {} as any;
};

export const getArticleDetails = async (id: string): Promise<IApiResponse<INutritionArticle>> => {
  // API implementation
  return {} as any;
};
