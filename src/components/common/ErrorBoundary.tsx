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

interface IErrorBoundaryState {
  /** hasError 的描述 */
  hasError: false | true;
  /** error 的描述 */
  error: Error /** null 的描述 */;
  /** null 的描述 */
  null;
}

export class ErrorBoundary extends React.Component<{}, IErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in ErrorBoundary.tsx:', 'Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2></h2>
          <p>{thisstateerrormessage}</p>
          <ErrorButton onClick={thishandleRetry}></ErrorButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}
