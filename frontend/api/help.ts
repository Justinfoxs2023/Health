import { IApiResponse } from './types';

export interface IHelpCategory {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** icon 的描述 */
  icon: string;
  /** description 的描述 */
  description: string;
  /** articleCount 的描述 */
  articleCount: number;
}

export interface IHelpArticle {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** viewCount 的描述 */
  viewCount: number;
  /** helpfulCount 的描述 */
  helpfulCount: number;
  /** updatedAt 的描述 */
  updatedAt: string;
}

export interface ICategoryDetail {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** articles 的描述 */
  articles: IHelpArticle[];
  /** subcategories 的描述 */
  subcategories: {
    id: string;
    name: string;
    articleCount: number;
    description: string;
  }[];
}

export interface IArticleSection {
  /** title 的描述 */
  title?: string;
  /** content 的描述 */
  content: string;
  /** tips 的描述 */
  tips?: string;
  /** imageUrl 的描述 */
  imageUrl?: string;
}

export interface IHelpArticle {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** category 的描述 */
  category: string;
  /** content 的描述 */
  content: IArticleSection[];
  /** viewCount 的描述 */
  viewCount: number;
  /** helpfulCount 的描述 */
  helpfulCount: number;
  /** notHelpfulCount 的描述 */
  notHelpfulCount: number;
  /** updatedAt 的描述 */
  updatedAt: string;
  /** relatedQuestions 的描述 */
  relatedQuestions: {
    id: string;
    title: string;
  }[];
}

export const getHelpCategories = async (): Promise<IApiResponse<IHelpCategory[]>> => {
  const response = await fetch('/api/help/categories');
  return response.json();
};

export const getHelpCategoryDetail = async (id: string): Promise<IApiResponse<ICategoryDetail>> => {
  const response = await fetch(`/api/help/categories/${id}`);
  return response.json();
};

export const searchHelp = async (keyword: string): Promise<IApiResponse<IHelpArticle[]>> => {
  const response = await fetch(`/api/help/search?keyword=${encodeURIComponent(keyword)}`);
  return response.json();
};

export const getHelpArticle = async (id: string): Promise<IApiResponse<IHelpArticle>> => {
  const response = await fetch(`/api/help/articles/${id}`);
  return response.json();
};

export const markArticleHelpful = async (params: {
  articleId: string;
  isHelpful: boolean;
}): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/help/articles/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
};
