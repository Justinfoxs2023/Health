import React, { useEffect } from 'react';

import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const RegistrationComplete: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 注册完成后自动跳转到健康调查问卷
    const timer = setTimeout(() => {
      navigate('/survey');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Result
      status="success"
      title="注册成功！"
      subTitle="为了给您提供更好的健康服务，请完成健康调查问卷"
      extra={[
        <Button type="primary" key="survey" onClick={() => navigate('/survey')}>
          立即填写问卷
        </Button>,
      ]}
    />
  );
};
