import React, { useState, useEffect, useCallback } from 'react';
import { Modal as AntModal, Button } from 'antd';
import { useI18n } from '../../hooks/useI18n';
import { useTheme } from '../../hooks/useTheme';
import './styles.less';

interface ModalProps {
  visible: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  width?: number | string;
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  confirmLoading?: boolean;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  afterClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  okButtonProps?: React.ComponentProps<typeof Button>;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  content,
  width = 520,
  centered = true,
  closable = true,
  maskClosable = true,
  confirmLoading = false,
  okText,
  cancelText,
  onOk,
  onCancel,
  afterClose,
  className = '',
  style,
  bodyStyle,
  maskStyle,
  okButtonProps,
  cancelButtonProps,
  children
}) => {
  const { t } = useI18n();
  /** 内容 */
  children: React.ReactNode;
  /** 底部内容 */
  footer?: React.ReactNode;
  /** 关闭回调 */
  onClose: () => void;
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 确认回调 */
  onOk?: () => void | Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
  /** 宽度 */
  width?: number | string;
  /** 自定义类名 */
  className?: string;
  /** 是否显示遮罩 */
  mask?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 确认按钮加载状态 */
  confirmLoading?: boolean;
}

/** 模态框组件 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  children,
  footer,
  onClose,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  width = 520,
  className = '',
  mask = true,
  maskClosable = true,
  closable = true,
  confirmLoading = false,
}) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const handleOk = async () => {
    try {
      await onOk?.();
      onClose();
    } catch (error) {
      console.error('Modal onOk error:', error);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleMaskClick = () => {
    if (maskClosable) {
      handleCancel();
    }
  };

  if (!visible) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {mask && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleMaskClick}
        />
      )}
      <div
        className={`relative bg-white rounded-lg shadow-xl transform transition-all ${className}`}
        style={{ width }}
      >
        {/* 头部 */}
        {(title || closable) && (
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            {title && <div className="text-lg font-medium">{title}</div>}
            {closable && (
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleCancel}
              >
                <span className="sr-only">关闭</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className="px-6 py-4">{children}</div>

        {/* 底部 */}
        {(footer !== null) && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            {footer || (
              <>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  onClick={handleCancel}
                >
                  {cancelText}
                </button>
                <button
                  className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none ${
                    confirmLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  onClick={handleOk}
                  disabled={confirmLoading}
                >
                  {confirmLoading && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                  {okText}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}; 