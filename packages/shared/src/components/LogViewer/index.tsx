import React from 'react';
import { logger, LogEntry, LogLevel } from '../../services/logger';
import { useI18n } from '../../services/i18n';

export interface LogViewerProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 日志级别过滤器 */
  levelFilter?: LogLevel[];
  /** 自动刷新间隔（毫秒） */
  refreshInterval?: number;
  /** 最大显示条数 */
  maxEntries?: number;
  /** 是否显示时间戳 */
  showTimestamp?: boolean;
  /** 是否显示日志级别 */
  showLevel?: boolean;
  /** 是否显示源代码信息 */
  showSource?: boolean;
  /** 是否显示额外数据 */
  showData?: boolean;
  /** 是否显示堆栈信息 */
  showStack?: boolean;
}

/**
 * 日志查看组件
 */
export const LogViewer: React.FC<LogViewerProps> = ({
  className,
  style,
  levelFilter,
  refreshInterval = 5000,
  maxEntries = 100,
  showTimestamp = true,
  showLevel = true,
  showSource = false,
  showData = false,
  showStack = true
}) => {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const { t, formatDate } = useI18n();

  // 加载日志
  const loadLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const allLogs = await logger.getLogs();
      const filteredLogs = levelFilter
        ? allLogs.filter(log => levelFilter.includes(log.level))
        : allLogs;
      setLogs(filteredLogs.slice(-maxEntries));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load logs'));
    } finally {
      setLoading(false);
    }
  }, [levelFilter, maxEntries]);

  // 自动刷新
  React.useEffect(() => {
    loadLogs();
    if (refreshInterval > 0) {
      const timer = setInterval(loadLogs, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [loadLogs, refreshInterval]);

  // 日志级别样式
  const getLevelStyle = (level: LogLevel): React.CSSProperties => {
    switch (level) {
      case 'debug':
        return { color: 'var(--theme-text-color-secondary)' };
      case 'info':
        return { color: 'var(--theme-primary-color)' };
      case 'warn':
        return { color: 'var(--theme-warning-color)' };
      case 'error':
        return { color: 'var(--theme-error-color)' };
      default:
        return {};
    }
  };

  if (error) {
    return (
      <div className="log-viewer__error">
        {t('logViewer.error')}: {error.message}
      </div>
    );
  }

  return (
    <div className={`log-viewer ${className || ''}`} style={style}>
      {loading && logs.length === 0 && (
        <div className="log-viewer__loading">
          {t('logViewer.loading')}
        </div>
      )}
      <div className="log-viewer__content">
        {logs.map((log, index) => (
          <div key={`${log.timestamp}-${index}`} className="log-viewer__entry">
            {showTimestamp && (
              <span className="log-viewer__timestamp">
                {formatDate(log.timestamp, 'YYYY-MM-DD HH:mm:ss.SSS')}
              </span>
            )}
            {showLevel && (
              <span
                className="log-viewer__level"
                style={getLevelStyle(log.level)}
              >
                [{log.level.toUpperCase()}]
              </span>
            )}
            <span className="log-viewer__message">{log.message}</span>
            {showSource && log.source && (
              <span className="log-viewer__source">@{log.source}</span>
            )}
            {showData && log.data && (
              <pre className="log-viewer__data">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            )}
            {showStack && log.stack && (
              <pre className="log-viewer__stack">{log.stack}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .log-viewer {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 200px;
    background-color: var(--theme-background-color);
    border: 1px solid var(--theme-border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .log-viewer__content {
    flex: 1;
    padding: 8px;
    overflow-y: auto;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.5;
  }

  .log-viewer__entry {
    margin-bottom: 4px;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .log-viewer__timestamp {
    color: var(--theme-text-color-secondary);
    margin-right: 8px;
  }

  .log-viewer__level {
    margin-right: 8px;
    font-weight: bold;
  }

  .log-viewer__source {
    color: var(--theme-text-color-secondary);
    margin-left: 8px;
    font-size: 11px;
  }

  .log-viewer__data,
  .log-viewer__stack {
    margin: 4px 0 8px 24px;
    padding: 8px;
    background-color: var(--theme-background-color-light);
    border-radius: 2px;
    font-size: 11px;
  }

  .log-viewer__error {
    padding: 16px;
    color: var(--theme-error-color);
    text-align: center;
  }

  .log-viewer__loading {
    padding: 16px;
    color: var(--theme-text-color-secondary);
    text-align: center;
  }
`;
document.head.appendChild(style); 