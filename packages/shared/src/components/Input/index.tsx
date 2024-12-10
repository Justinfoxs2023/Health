import React from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 标签文本 */
  label?: string;
  /** 错误信息 */
  error?: string;
  /** 帮助文本 */
  helpText?: string;
  /** 前缀图标 */
  prefix?: React.ReactNode;
  /** 后缀图标 */
  suffix?: React.ReactNode;
  /** 输入框大小 */
  size?: 'small' | 'medium' | 'large';
  /** 块级输入框 */
  block?: boolean;
}

/** 基础输入框组件 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  prefix,
  suffix,
  size = 'medium',
  block = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-md border focus:outline-none focus:ring-2 transition-colors';
  const sizeStyles = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2',
    large: 'px-4 py-3 text-lg'
  };
  const statusStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200';
  const blockStyles = block ? 'w-full' : '';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

  return (
    <div className={`${block ? 'w-full' : 'inline-block'}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          className={`
            ${baseStyles}
            ${sizeStyles[size]}
            ${statusStyles}
            ${blockStyles}
            ${disabledStyles}
            ${prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {(error || helpText) && (
        <div className="mt-1 text-sm">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span className="text-gray-500">{helpText}</span>
          )}
        </div>
      )}
    </div>
  );
}; 