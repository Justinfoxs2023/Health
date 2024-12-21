import React from 'react';

import { logger } from '../../services/logger';
import { useI18n } from '../../services/i18n';

export interface IErrorBoundaryProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 自定义错误渲染 */
  fallback?: React.ReactNode;
  /** 错误回调 */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface IErrorBoundaryState {
  /** hasError 的描述 */
  hasError: boolean;
  /** error 的描述 */
  error: Error | null;
}

/**
 * 错误边界组件
 */
export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // 记录错误日志
    logger.error('React error boundary caught error', {
      error,
      errorInfo,
    });

    // 调用错误回调
    this.props.onError?.(error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}

interface IErrorFallbackProps {
  /** error 的描述 */
  error: Error | null;
  /** onReload 的描述 */
  onReload: () => void;
}

const ErrorFallback: React.FC<IErrorFallbackProps> = ({ error, onReload }) => {
  const { t } = useI18n();

  return (
    <div className="error-boundary">
      <h2 className="error-boundary__title">{t('errorBoundary.title')}</h2>
      <p className="error-boundary__message">{t('errorBoundary.message')}</p>
      {error && (
        <pre className="error-boundary__details">
          {error.message}
          {error.stack}
        </pre>
      )}
      <button className="error-boundary__button" onClick={onReload}>
        {t('errorBoundary.reload')}
      </button>
    </div>
  );
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .error-boundary {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
    min-height: 400px;
    background-color: var(--theme-background-color);
  }

  .error-boundary__title {
    margin: 0 0 16px;
    color: var(--theme-error-color);
    font-size: 24px;
  }

  .error-boundary__message {
    margin: 0 0 24px;
    color: var(--theme-text-color);
    font-size: 16px;
  }

  .error-boundary__details {
    margin: 0 0 24px;
    padding: 16px;
    width: 100%;
    max-width: 600px;
    overflow: auto;
    background-color: var(--theme-background-color-light);
    border-radius: 4px;
    font-size: 12px;
    text-align: left;
    color: var(--theme-text-color-secondary);
  }

  .error-boundary__button {
    padding: 8px 24px;
    border: none;
    border-radius: 4px;
    background-color: var(--theme-primary-color);
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .error-boundary__button:hover {
    background-color: var(--theme-primary-color-dark);
  }
`;
document.head.appendChild(style);
