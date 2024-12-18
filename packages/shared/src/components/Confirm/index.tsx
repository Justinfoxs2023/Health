import React from 'react';

import ReactDOM from 'react-dom';

/** 确认对话框配置 */
export interface IConfirmConfig {
  /** 标题 */
  title?: React.ReactNode;
  /** 内容 */
  content: React.ReactNode;
  /** 确认按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认按钮类型 */
  okType?: 'primary' | 'danger';
  /** 点击确认回调 */
  onOk?: () => void | Promise<void>;
  /** 点击取消回调 */
  onCancel?: () => void;
}

/** 确认对话框Props */
interface IConfirmProps extends IConfirmConfig {
  /** 是否可见 */
  visible: boolean;
  /** 关闭对话框 */
  onClose: () => void;
}

/** 确认对话框组件 */
const Confirm: React.FC<IConfirmProps> = ({
  title = '确认',
  content,
  okText = '确定',
  cancelText = '取消',
  okType = 'primary',
  onOk,
  onCancel,
  visible,
  onClose,
}) => {
  if (!visible) return null;

  const handleOk = async () => {
    try {
      await onOk?.();
      onClose();
    } catch (error) {
      console.error('Error in index.tsx:', '确认操作失败:', error);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCancel}>
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>

        {/* 对话框 */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* 标题 */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  {title}
                </h3>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">{content}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                okType === 'primary'
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              }`}
              onClick={handleOk}
            >
              {okText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** 确认对话框容器 */
class ConfirmContainer {
  private static instance: ConfirmContainer;
  private container: HTMLDivElement;
  private visible = false;
  private config: IConfirmConfig = {
    content: '',
  };

  private constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  public static getInstance(): ConfirmContainer {
    if (!ConfirmContainer.instance) {
      ConfirmContainer.instance = new ConfirmContainer();
    }
    return ConfirmContainer.instance;
  }

  /** 显示确认对话框 */
  public show(config: IConfirmConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.config = {
        ...config,
        onOk: async () => {
          try {
            await config.onOk?.();
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        onCancel: () => {
          config.onCancel?.();
          reject(new Error('用户取消'));
        },
      };
      this.visible = true;
      this.render();
    });
  }

  /** 关闭确认对话框 */
  private close() {
    this.visible = false;
    this.render();
  }

  /** 渲染确认对话框 */
  private render() {
    ReactDOM.render(
      <Confirm {...this.config} visible={this.visible} onClose={() => this.close()} />,
      this.container,
    );
  }
}

/** 确认对话框API */
export const confirm = {
  /** 显示确认对话框 */
  show(config: IConfirmConfig) {
    return ConfirmContainer.getInstance().show(config);
  },
};

export default Confirm;
