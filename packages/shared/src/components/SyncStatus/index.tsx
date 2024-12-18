import React, { useEffect, useState } from 'react';

import { Button } from '../Button';
import { Loading } from '../Loading';
import { Message } from '../Message';
import { formatDistanceToNow } from 'date-fns';
import { syncService, SyncState } from '../../services/sync';
import { useTranslation } from 'react-i18next';
import { zhCN } from 'date-fns/locale';

/** 同步状态组件属性 */
export interface ISyncStatusProps {
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 是否显示手动同步按钮 */
  showSyncButton?: boolean;
  /** 自定义类名 */
  className?: string;
}

/** 同步状态组件 */
export const SyncStatus: React.FC<ISyncStatusProps> = ({
  showDetails = false,
  showSyncButton = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<SyncState>(syncService.getState());

  useEffect(() => {
    // 监听同步状态变化
    const handleStateChange = (event: CustomEvent<SyncState>) => {
      setState(event.detail);
    };

    window.addEventListener('syncStateChange', handleStateChange as EventListener);

    return () => {
      window.removeEventListener('syncStateChange', handleStateChange as EventListener);
    };
  }, []);

  // 处理手动同步
  const handleSync = async () => {
    try {
      await syncService.sync();
      Message.success(t('sync.success'));
    } catch (error) {
      Message.error(t('sync.error'));
    }
  };

  // 获取状态图标和文本
  const getStatusInfo = () => {
    if (state.offline) {
      return {
        icon: '🔴',
        text: t('sync.offline'),
        className: 'text-red-500',
      };
    }
    if (state.syncing) {
      return {
        icon: '🔄',
        text: t('sync.syncing'),
        className: 'text-blue-500',
      };
    }
    if (state.pendingCount > 0) {
      return {
        icon: '⚠️',
        text: t('sync.pending', { count: state.pendingCount }),
        className: 'text-yellow-500',
      };
    }
    return {
      icon: '✅',
      text: t('sync.synced'),
      className: 'text-green-500',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* 状态图标和文本 */}
      <span className={`flex items-center ${statusInfo.className}`}>
        <span className="mr-1">{statusInfo.icon}</span>
        <span>{statusInfo.text}</span>
      </span>

      {/* 同步按钮 */}
      {showSyncButton && !state.offline && !state.syncing && (
        <Button size="small" onClick={handleSync} disabled={state.syncing} className="ml-2">
          {state.syncing ? <Loading size="small" /> : t('sync.button')}
        </Button>
      )}

      {/* 详细信息 */}
      {showDetails && (
        <div className="text-sm text-gray-500 mt-1">
          {state.lastSyncTime && (
            <div>
              {t('sync.lastSync', {
                time: formatDistanceToNow(state.lastSyncTime, {
                  addSuffix: true,
                  locale: zhCN,
                }),
              })}
            </div>
          )}
          {state.pendingCount > 0 && (
            <div>
              {t('sync.pendingDetails', {
                count: state.pendingCount,
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
