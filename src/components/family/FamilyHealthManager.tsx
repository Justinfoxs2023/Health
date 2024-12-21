import React, { useEffect, useState } from 'react';

import { ErrorBoundary } from '../ErrorBoundary';
import { message } from 'antd';
import { request } from '../../utils/request';

interface IFamilyMember {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** healthStatus 的描述 */
  healthStatus: string;
}

export const FamilyHealthManager: React.FC = () => {
  const [members, setMembers] = useState<IFamilyMember[]>([]);
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
          <div></div>
        ) : (
          <div className="members-list">
            {members.map(member => (
              <div key={member.id} className="member-card">
                <h3>{membername}</h3>
                <p> {memberhealthStatus}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
