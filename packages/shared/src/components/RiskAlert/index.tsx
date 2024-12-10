import React, { useEffect, useState } from 'react';
import { Alert, Badge, Card, Space, Tag, Timeline } from 'antd';
import { useRiskAlert } from '../../hooks/useRiskAlert';
import { RiskAlert } from '../../services/health/types';
import './styles.less';

interface RiskAlertProps {
  className?: string;
  style?: React.CSSProperties;
  maxAlerts?: number;
  showHandled?: boolean;
}

export const RiskAlertComponent: React.FC<RiskAlertProps> = ({
  className,
  style,
  maxAlerts = 5,
  showHandled = false
}) => {
  const { alerts, loading, error, handleAlert, clearHandled } = useRiskAlert();
  const [activeAlerts, setActiveAlerts] = useState<RiskAlert[]>([]);

  useEffect(() => {
    setActiveAlerts(
      alerts
        .filter(alert => showHandled || !alert.handled)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, maxAlerts)
    );
  }, [alerts, showHandled, maxAlerts]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (error) {
    return (
      <Alert
        type="error"
        message="错误"
        description="加载健康风险警报时出错"
        className={className}
        style={style}
      />
    );
  }

  return (
    <Card
      title={
        <Space>
          健康风险警报
          <Badge count={activeAlerts.filter(a => !a.handled).length} />
        </Space>
      }
      extra={
        <a href="#" onClick={clearHandled}>
          清除已处理
        </a>
      }
      className={`risk-alert-card ${className || ''}`}
      style={style}
      loading={loading}
    >
      {activeAlerts.length === 0 ? (
        <Alert message="暂无风险警报" type="info" showIcon />
      ) : (
        <Timeline>
          {activeAlerts.map(alert => (
            <Timeline.Item
              key={alert.id}
              color={getLevelColor(alert.level)}
              dot={
                <Badge
                  status={alert.handled ? 'default' : 'processing'}
                  style={{ marginTop: '6px' }}
                />
              }
            >
              <Card
                size="small"
                className={`risk-alert-item ${alert.handled ? 'handled' : ''}`}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <Tag color={getLevelColor(alert.level)}>{alert.level}</Tag>
                    <span className="risk-alert-time">{formatTime(alert.timestamp)}</span>
                  </Space>
                  <div className="risk-alert-message">{alert.message}</div>
                  {alert.data && (
                    <div className="risk-alert-data">
                      {Object.entries(alert.data).map(([key, value]) => (
                        <div key={key} className="risk-alert-data-item">
                          <span className="label">{key}:</span>
                          <span className="value">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!alert.handled && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAlert(alert.id);
                      }}
                      className="risk-alert-action"
                    >
                      标记为已处理
                    </a>
                  )}
                </Space>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Card>
  );
}; 