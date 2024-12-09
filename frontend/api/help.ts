import { ApiResponse } from './types';

export interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  articleCount: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  viewCount: number;
  helpfulCount: number;
  updatedAt: string;
}

export interface CategoryDetail {
  id: string;
  name: string;
  description: string;
  articles: HelpArticle[];
  subcategories: {
    id: string;
    name: string;
    articleCount: number;
    description: string;
  }[];
}

export interface ArticleSection {
  title?: string;
  content: string;
  tips?: string;
  imageUrl?: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: ArticleSection[];
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  updatedAt: string;
  relatedQuestions: {
    id: string;
    title: string;
  }[];
}

export const getHelpCategories = async (): Promise<ApiResponse<HelpCategory[]>> => {
  const response = await fetch('/api/help/categories');
  return response.json();
};

export const getHelpCategoryDetail = async (id: string): Promise<ApiResponse<CategoryDetail>> => {
  const response = await fetch(`/api/help/categories/${id}`);
  return response.json();
};

export const searchHelp = async (keyword: string): Promise<ApiResponse<HelpArticle[]>> => {
  const response = await fetch(`/api/help/search?keyword=${encodeURIComponent(keyword)}`);
  return response.json();
};

export const getHelpArticle = async (id: string): Promise<ApiResponse<HelpArticle>> => {
  const response = await fetch(`/api/help/articles/${id}`);
  return response.json();
};

export const markArticleHelpful = async (params: { articleId: string; isHelpful: boolean }): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/help/articles/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  return response.json();
}; 