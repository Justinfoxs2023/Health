import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮类型 */
  variant?: 'primary' | 'secondary' | 'text';
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
  /** 加载状态 */
  loading?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 块级按钮 */
  block?: boolean;
}

/** 基础按钮组件 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  block = false,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-md font-medium focus:outline-none transition-colors';
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    text: 'bg-transparent text-gray-600 hover:bg-gray-100'
  };
  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  const blockStyles = block ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const loadingStyles = loading ? 'relative opacity-75 cursor-wait' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${blockStyles} ${disabledStyles} ${loadingStyles} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}; 