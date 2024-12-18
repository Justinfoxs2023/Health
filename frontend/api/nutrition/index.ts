import { IApiResponse, IQueryParams } from '../../types/api';

export interface IArticle {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** summary 的描述 */
  summary: string;
  /** coverImage 的描述 */
  coverImage?: string;
  /** category 的描述 */
  category: string;
  /** author 的描述 */
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  /** readCount 的描述 */
  readCount: number;
  /** createdAt 的描述 */
  createdAt: string;
}

export interface IQuestion {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** user 的描述 */
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  /** tags 的描述 */
  tags: string[];
  /** answerCount 的描述 */
  answerCount: number;
  /** viewCount 的描述 */
  viewCount: number;
  /** createdAt 的描述 */
  createdAt: string;
  /** images 的描述 */
  images?: string[];
}

export const getNutritionArticles = async (
  params: IQueryParams,
): Promise<IApiResponse<IArticle[]>> => {
  // 实现
  return { code: 200, data: [], message: 'success' };
};

export const getNutritionQuestions = async (
  params: IQueryParams,
): Promise<IApiResponse<IQuestion[]>> => {
  // 实现
  return { code: 200, data: [], message: 'success' };
};

export const getArticleDetails = async (id: string): Promise<IApiResponse<IArticle>> => {
  // API 实现
  return { code: 200, data: {} as IArticle, message: 'success' };
};

export const getQuestionDetails = async (
  id: string,
): Promise<
  IApiResponse<{
    question: IQuestion;
    answers: Answer[];
  }>
> => {
  // API 实现
  return { code: 200, data: { question: {} as IQuestion, answers: [] }, message: 'success' };
};

export const createQuestion = async (params: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  isPrivate: boolean;
}): Promise<IApiResponse<IQuestion>> => {
  // API 实现
  return { code: 200, data: {} as IQuestion, message: 'success' };
};

// ... 其他 API
