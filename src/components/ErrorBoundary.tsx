import React from 'react';

import { ErrorMonitor } from '../utils/error-monitor';

interface IProps {
  /** children 的描述 */
    children: ReactReactNode;
}

interface IState {
  /** hasError 的描述 */
    hasError: false | true;
  /** error 的描述 */
    error: Error;
}

export class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorMonitor.logError(error, '组件错误');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2></h2>
          <p>{thisstateerrormessage}</p>
          <button onClick={ => thissetState{ hasError false }}></button>
        </div>
      );
    }

    return this.props.children;
  }
}
