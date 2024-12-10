import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { message } from 'antd';
import { request } from '../../utils/request';

interface FamilyMember {
  id: string;
  name: string;
  healthStatus: string;
}

export const FamilyHealthManager: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/family/members');
      setMembers(response.data);
    } catch (error) {
      message.error('获取家庭成员信息失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="family-health-container">
        {loading ? (
          <div>加载中...</div>
        ) : (
          <div className="members-list">
            {members.map(member => (
              <div key={member.id} className="member-card">
                <h3>{member.name}</h3>
                <p>健康状态: {member.healthStatus}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}; 