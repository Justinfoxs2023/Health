import { ApiResponse, QueryParams } from '../../types/api';

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  coverImage?: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  readCount: number;
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  answerCount: number;
  viewCount: number;
  createdAt: string;
  images?: string[];
}

export const getNutritionArticles = async (params: QueryParams): Promise<ApiResponse<Article[]>> => {
  // 实现
  return { code: 200, data: [], message: 'success' };
};

export const getNutritionQuestions = async (params: QueryParams): Promise<ApiResponse<Question[]>> => {
  // 实现
  return { code: 200, data: [], message: 'success' };
};

export const getArticleDetails = async (id: string): Promise<ApiResponse<Article>> => {
  // API 实现
  return { code: 200, data: {} as Article, message: 'success' };
};

export const getQuestionDetails = async (id: string): Promise<ApiResponse<{
  question: Question;
  answers: Answer[];
}>> => {
  // API 实现
  return { code: 200, data: { question: {} as Question, answers: [] }, message: 'success' };
};

export const createQuestion = async (params: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  isPrivate: boolean;
}): Promise<ApiResponse<Question>> => {
  // API 实现
  return { code: 200, data: {} as Question, message: 'success' };
};

// ... 其他 API 