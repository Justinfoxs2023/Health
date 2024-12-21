import React from 'react';

import ReactDOM from 'react-dom';

/** 加载状态Props */
interface ILoadingProps {
  /** 是否可见 */
  visible: boolean;
  /** 加载提示文本 */
  tip?: React.ReactNode;
  /** 是否全屏 */
  fullscreen?: boolean;
}

/** 加载状态组件 */
const Loading: React.FC<ILoadingProps> = ({ visible, tip = '加载中...', fullscreen = false }) => {
  if (!visible) return null;

  const content = (
    <div
      className={`
        flex items-center justify-center
        ${fullscreen ? 'fixed inset-0 z-50 bg-black bg-opacity-50' : 'relative'}
      `}
    >
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {tip && <div className="text-sm font-medium text-gray-700">{tip}</div>}
        </div>
      </div>
    </div>
  );

  return fullscreen ? ReactDOM.createPortal(content, document.body) : content;
};

/** 加载状态容器 */
class LoadingContainer {
  private static instance: LoadingContainer;
  private container: HTMLDivElement;
  private count = 0;

  private constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  public static getInstance(): LoadingContainer {
    if (!LoadingContainer.instance) {
      LoadingContainer.instance = new LoadingContainer();
    }
    return LoadingContainer.instance;
  }

  /** 显示加载状态 */
  public show(tip?: React.ReactNode): () => void {
    this.count++;
    this.render();

    return () => {
      this.count = Math.max(0, this.count - 1);
      this.render();
    };
  }

  /** 隐藏所有加载状态 */
  public hideAll(): void {
    this.count = 0;
    this.render();
  }

  /** 渲染加载状态 */
  private render() {
    ReactDOM.render(
      <Loading
        visible={this.count > 0}
        tip={this.count > 0 ? `加载中...(${this.count})` : undefined}
        fullscreen={true}
      />,
      this.container,
    );
  }
}

/** 加载状态API */
export const loading = {
  /** 显示加载状态 */
  show(tip?: React.ReactNode) {
    return LoadingContainer.getInstance().show(tip);
  },
  /** 隐藏所有加载状态 */
  hideAll() {
    LoadingContainer.getInstance().hideAll();
  },
};

export default Loading;
