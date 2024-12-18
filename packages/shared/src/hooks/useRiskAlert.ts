import { useState, useEffect, useCallback, useRef } from 'react';

import { IRiskAlert, IRiskRule } from '../services/health/types';
import { RiskAlertService } from '../services/health/risk-alert';
import { message } from 'antd';

const riskAlertService = new RiskAlertService();

export interface IUseRiskAlertOptions {
  /** autoRefresh 的描述 */
  autoRefresh?: boolean;
  /** refreshInterval 的描述 */
  refreshInterval?: number;
  /** maxAlerts 的描述 */
  maxAlerts?: number;
  /** onError 的描述 */
  onError?: (error: Error) => void;
}

export function useRiskAlert(options: IUseRiskAlertOptions = {}): {
  alerts: import('D:/Health/packages/shared/src/services/health/types').IRiskAlert[];
  loading: boolean;
  error: Error | null;
  handleAlert: (alertId: string) => Promise<void>;
  clearHandled: () => Promise<void>;
  getAlertsByType: (
    type: string,
  ) => import('D:/Health/packages/shared/src/services/health/types').IRiskAlert[];
  getActiveAlerts: () => import('D:/Health/packages/shared/src/services/health/types').IRiskAlert[];
  addRule: (
    rule: import('D:/Health/packages/shared/src/services/health/types').IRiskRule,
  ) => Promise<void>;
  removeRule: (ruleId: string) => Promise<void>;
  refresh: () => Promise<void>;
  hasActiveAlerts: boolean;
  alertCount: number;
  activeAlertCount: number;
  getAlertsByLevel: (
    level: 'low' | 'medium' | 'high',
  ) => import('D:/Health/packages/shared/src/services/health/types').IRiskAlert[];
  getLatestAlert: () => import('D:/Health/packages/shared/src/services/health/types').IRiskAlert;
  clearError: () => void;
} {
  const { autoRefresh = true, refreshInterval = 30000, maxAlerts = 100, onError } = options;

  const [alerts, setAlerts] = useState<IRiskAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout>();

  // 错误处理函数
  const handleError = console.error(
    'Error in useRiskAlert.ts:',
    (error: Error) => {
      setError(error);
      onError?.(error);
      message.error('健康风险警报系统出现错误');
      console.error('Error in useRiskAlert.ts:', 'RiskAlert Error:', error);
    },
    [onError],
  );

  // 刷新警报数据
  const refreshAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const state = await riskAlertService.getState().toPromise();
      setAlerts(state.alerts.slice(0, maxAlerts));
      setError(null);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [maxAlerts, handleError]);

  // 初始化自动刷新
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshAlerts();
      refreshTimerRef.current = setInterval(refreshAlerts, refreshInterval);

      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshAlerts]);

  // 处理警报
  const handleAlert = useCallback(
    async (alertId: string) => {
      try {
        setLoading(true);
        await riskAlertService.markAlertHandled(alertId);
        await refreshAlerts();
        message.success('警报已处理');
      } catch (err) {
        handleError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshAlerts, handleError],
  );

  // 清除已处理的警报
  const clearHandled = useCallback(async () => {
    try {
      setLoading(true);
      await riskAlertService.clearHandledAlerts();
      await refreshAlerts();
      message.success('已清除处理过的警报');
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshAlerts, handleError]);

  // 获取特定类型的警报
  const getAlertsByType = useCallback(
    (type: string) => {
      return alerts.filter(alert => alert.type === type);
    },
    [alerts],
  );

  // 获取活跃警报
  const getActiveAlerts = useCallback(() => {
    return alerts.filter(alert => !alert.handled);
  }, [alerts]);

  // 添加自定义规则
  const addRule = useCallback(
    async (rule: IRiskRule) => {
      try {
        setLoading(true);
        await riskAlertService.addRule(rule);
        message.success('规则添加成功');
        await refreshAlerts();
      } catch (err) {
        handleError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshAlerts, handleError],
  );

  // 移除规则
  const removeRule = useCallback(
    async (ruleId: string) => {
      try {
        setLoading(true);
        await riskAlertService.removeRule(ruleId);
        message.success('规则已移除');
        await refreshAlerts();
      } catch (err) {
        handleError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshAlerts, handleError],
  );

  // 手动刷新
  const refresh = useCallback(async () => {
    try {
      await refreshAlerts();
      message.success('警报数据已更新');
    } catch (err) {
      handleError(err as Error);
    }
  }, [refreshAlerts, handleError]);

  return {
    alerts,
    loading,
    error,
    handleAlert,
    clearHandled,
    getAlertsByType,
    getActiveAlerts,
    addRule,
    removeRule,
    refresh,
    // 额外的工具方法
    hasActiveAlerts: alerts.some(alert => !alert.handled),
    alertCount: alerts.length,
    activeAlertCount: alerts.filter(alert => !alert.handled).length,
    getAlertsByLevel: (level: IRiskAlert['level']) => alerts.filter(alert => alert.level === level),
    getLatestAlert: () => alerts[0],
    clearError: () => setError(null),
  };
}
