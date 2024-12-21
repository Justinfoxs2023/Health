import React from 'react';
import { useCallback } from 'react';

import './styles.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { message } from 'antd';
import { saveSurveyResults, generateAIReport } from '../../services/survey.service';
import { surveyJson } from './surveyConfig';
import { useNavigate } from 'react-router-dom';

export const HealthSurvey: React.FC = () => {
  const navigate = useNavigate();
  const survey = new Model(surveyJson);

  const handleComplete = console.error(
    'Error in index.tsx:',
    async (sender: any) => {
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
        console.error('Error in index.tsx:', '问卷处理失败:', error);
        message.error('保存问卷结果失败，请稍后重试');
      }
    },
    [navigate],
  );

  survey.onComplete.add(handleComplete);

  return (
    <div className="survey-container">
      <Survey model={survey} />
    </div>
  );
};
