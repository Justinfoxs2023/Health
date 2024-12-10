import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  color: ${({ theme }) => theme.colors.error.main};
`;

const ErrorButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1, 3)};
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrastText};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2>出错了</h2>
          <p>{this.state.error?.message}</p>
          <ErrorButton onClick={this.handleRetry}>
            重试
          </ErrorButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
} 