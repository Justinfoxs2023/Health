import { ApiResponse } from '../types/api';

export interface NutritionQuestion {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  status: string;
  userId: string;
  createdAt: string;
  answers: Answer[];
}

export interface Answer {
  _id: string;
  content: string;
  userId: string;
  likes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface NutritionArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
  };
  coverImage: string;
  summary: string;
  likes: number;
  views: number;
  createdAt: string;
}

export const getNutritionQuestions = async (params?: {
  category?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<NutritionQuestion[]>> => {
  // API implementation
  return {} as any;
};

export const getQuestionDetails = async (id: string): Promise<ApiResponse<NutritionQuestion>> => {
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
}): Promise<ApiResponse<NutritionQuestion>> => {
  // API implementation
  return {} as any;
};

export const getNutritionArticles = async (params?: {
  category?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<NutritionArticle[]>> => {
  // API implementation
  return {} as any;
};

export const getArticleDetails = async (id: string): Promise<ApiResponse<NutritionArticle>> => {
  // API implementation 
  return {} as any;
}; 