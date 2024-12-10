import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spin, message } from 'antd';
import { authService } from '../../services/auth.service';

export const SocialLoginCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 从 URL 获取授权码和状态
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code) {
          throw new Error('授权失败，未获取到授权码');
        }

        // 从 sessionStorage 获取平台信息
        const platform = sessionStorage.getItem('socialLoginPlatform') as Social.Platform;
        if (!platform) {
          throw new Error('未知的登录平台');
        }

        // 调用后端接口完成登录
        const response = await authService.socialLogin({
          platform,
          code,
          state
        });

        // 清理 sessionStorage
        sessionStorage.removeItem('socialLoginPlatform');

        // 处理登录成功
        message.success('登录成功');
        navigate('/dashboard');
      } catch (error) {
        message.error('登录失败：' + (error as Error).message);
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" tip="登录中..." />
    </div>
  );
}; 