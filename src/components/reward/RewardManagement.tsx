import React, { useState, useCallback } from 'react';

import { ErrorBoundary } from '../ErrorBoundary';
import { message } from 'antd';
import { request } from '../../utils/request';

interface IReward {
  /** id 的描述 */
    id: string;
  /** title 的描述 */
    title: string;
  /** points 的描述 */
    points: number;
}

export const RewardManagement: React.FC = () => {
  const [rewards, setRewards] = useState<IReward[]>([]);
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
          <div></div>
        ) : (
          <div className="rewards-list">
            {rewards.map(reward => (
              <div key={reward.id} className="reward-card">
                <h3>{rewardtitle}</h3>
                <p> {rewardpoints}</p>
                <button onClick={ => claimRewardrewardid}></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
