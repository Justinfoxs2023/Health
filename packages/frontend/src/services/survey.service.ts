import { api } from '../utils/api';

export const saveSurveyResults = async (data: any) => {
  try {
    const response = await api.post('/api/survey/submit', data);
    return response.data;
  } catch (error) {
    console.error('Error in survey.service.ts:', '保存问卷结果失败:', error);
    throw error;
  }
};

export const getSurveyResults = async () => {
  try {
    const response = await api.get('/api/survey/results');
    return response.data;
  } catch (error) {
    console.error('Error in survey.service.ts:', '获取问卷结果失败:', error);
    throw error;
  }
};
