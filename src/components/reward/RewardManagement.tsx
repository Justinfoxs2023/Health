import React, { useState, useCallback } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { message } from 'antd';
import { request } from '../../utils/request';

interface Reward {
  id: string;
  title: string;
  points: number;
}

export const RewardManagement: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/rewards');
      setRewards(response.data);
    } catch (error) {
      message.error('获取奖励信息失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = async (rewardId: string) => {
    try {
      await request.post(`/api/rewards/${rewardId}/claim`);
      message.success('成功领取奖励');
      fetchRewards(); // 刷新列表
    } catch (error) {
      message.error('领取奖励失败');
    }
  };

  return (
    <ErrorBoundary>
      <div className="rewards-container">
        {loading ? (
          <div>加载中...</div>
        ) : (
          <div className="rewards-list">
            {rewards.map(reward => (
              <div key={reward.id} className="reward-card">
                <h3>{reward.title}</h3>
                <p>所需积分: {reward.points}</p>
                <button onClick={() => claimReward(reward.id)}>
                  领取奖励
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}; 