import React from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { surveyJson } from './surveyConfig';
import { saveSurveyResults, generateAIReport } from '../../services/survey.service';
import './styles.css';

export const HealthSurvey: React.FC = () => {
  const navigate = useNavigate();
  const survey = new Model(surveyJson);
  
  const handleComplete = useCallback(async (sender: any) => {
    try {
      const results = sender.data;
      // 保存问卷结果
      const savedSurvey = await saveSurveyResults(results);
      // 生成AI分析报告
      const aiReport = await generateAIReport(savedSurvey.id);
      
      message.success('问卷已完成，正在为您生成健康报告...');
      // 跳转到报告页面
      navigate(`/health-profile/report/${aiReport.id}`);
    } catch (error) {
      console.error('问卷处理失败:', error);
      message.error('保存问卷结果失败，请稍后重试');
    }
  }, [navigate]);

  survey.onComplete.add(handleComplete);

  return (
    <div className="survey-container">
      <Survey model={survey} />
    </div>
  );
}; 