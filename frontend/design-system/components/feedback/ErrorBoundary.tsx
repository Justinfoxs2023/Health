import React from 'react';

import { CustomIcon } from '../../icons';
import { DesignTokens } from '../../tokens';
import { Logger } from '../../utils/logger';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface IErrorBoundaryProps {
  /** fallback 的描述 */
  fallback?: React.ReactNode;
  /** onError 的描述 */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** onRetry 的描述 */
  onRetry?: () => void;
}

interface IErrorBoundaryState {
  /** hasError 的描述 */
  hasError: boolean;
  /** error 的描述 */
  error?: Error;
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  private logger: Logger;

  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.logger = new Logger('ErrorBoundary');
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.logger.error('组件错误', { error, errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <CustomIcon name="error-outline" size={48} color={DesignTokens.colors.functional.error} />

          <Text style={styles.title}>出错了</Text>

          <Text style={styles.message}>{this.state.error?.message || '发生了一些错误'}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
            <CustomIcon name="refresh" size={20} color={DesignTokens.colors.neutral.white} />
            <Text style={styles.retryText}>重试</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => {
              // 实现错误报告逻辑
            }}
          >
            <Text style={styles.reportText}>报告问题</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: DesignTokens.spacing.xl,
    backgroundColor: DesignTokens.colors.background.paper,
  },
  title: {
    marginTop: DesignTokens.spacing.lg,
    fontSize: DesignTokens.typography.sizes.xl,
    fontWeight: String(DesignTokens.typography.weights.bold),
    color: DesignTokens.colors.text.primary,
  },
  message: {
    marginTop: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.md,
    color: DesignTokens.colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.brand.primary,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    marginTop: DesignTokens.spacing.xl,
  },
  retryText: {
    marginLeft: DesignTokens.spacing.sm,
    color: DesignTokens.colors.neutral.white,
    fontSize: DesignTokens.typography.sizes.md,
    fontWeight: String(DesignTokens.typography.weights.medium),
  },
  reportButton: {
    marginTop: DesignTokens.spacing.md,
  },
  reportText: {
    color: DesignTokens.colors.brand.primary,
    fontSize: DesignTokens.typography.sizes.sm,
  },
});
