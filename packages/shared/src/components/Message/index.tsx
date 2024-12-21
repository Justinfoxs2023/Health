import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';

/** 消息类型 */
export type MessageType = 'info' | 'success' | 'warning' | 'error';

/** 消息配置 */
export interface IMessageConfig {
  /** 消息内容 */
  content: React.ReactNode;
  /** 消息类型 */
  type?: MessageType;
  /** 显示时长(毫秒) */
  duration?: number;
  /** 关闭回调 */
  onClose?: () => void;
}

/** 消息组件Props */
interface IMessageProps extends IMessageConfig {
  /** 是否可见 */
  visible: boolean;
  /** 关闭消息 */
  onClose: () => void;
}

const typeToIcon = {
  info: (
    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const typeToClass = {
  info: 'bg-blue-50 text-blue-800',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error: 'bg-red-50 text-red-800',
};

/** 消息组件 */
const Message: React.FC<IMessageProps> = ({ content, type = 'info', visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg ${typeToClass[type]}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">{typeToIcon[type]}</div>
        <div className="ml-3">
          <p className="text-sm font-medium">{content}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'info'
                  ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                  : type === 'success'
                  ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                  : type === 'warning'
                  ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
                  : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              }`}
              onClick={onClose}
            >
              <span className="sr-only">关闭</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** 消息容器 */
class MessageContainer {
  private static instance: MessageContainer;
  private container: HTMLDivElement;
  private messageQueue: Array<{
    key: number;
    config: IMessageConfig;
  }> = [];
  private key = 0;

  private constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  public static getInstance(): MessageContainer {
    if (!MessageContainer.instance) {
      MessageContainer.instance = new MessageContainer();
    }
    return MessageContainer.instance;
  }

  /** 显示消息 */
  public show(config: IMessageConfig): () => void {
    const key = this.key++;
    const duration = config.duration ?? 3000;

    this.messageQueue.push({ key, config });
    this.render();

    // 定时关闭
    if (duration > 0) {
      setTimeout(() => {
        this.remove(key);
      }, duration);
    }

    // 返回关闭函数
    return () => this.remove(key);
  }

  /** 移除消息 */
  private remove(key: number) {
    const index = this.messageQueue.findIndex(item => item.key === key);
    if (index > -1) {
      const [removed] = this.messageQueue.splice(index, 1);
      removed.config.onClose?.();
      this.render();
    }
  }

  /** 渲染消息 */
  private render() {
    ReactDOM.render(
      <>
        {this.messageQueue.map(({ key, config }) => (
          <Message key={key} {...config} visible={true} onClose={() => this.remove(key)} />
        ))}
      </>,
      this.container,
    );
  }
}

/** 消息API */
export const message = {
  /** 信息提示 */
  info(content: React.ReactNode, duration?: number) {
    return MessageContainer.getInstance().show({ content, type: 'info', duration });
  },
  /** 成功提示 */
  success(content: React.ReactNode, duration?: number) {
    return MessageContainer.getInstance().show({ content, type: 'success', duration });
  },
  /** 警告提示 */
  warning(content: React.ReactNode, duration?: number) {
    return MessageContainer.getInstance().show({ content, type: 'warning', duration });
  },
  /** 错误提示 */
  error(content: React.ReactNode, duration?: number) {
    return MessageContainer.getInstance().show({ content, type: 'error', duration });
  },
};
