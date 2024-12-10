import React from 'react';
import { useForm, FormProvider, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

export interface FormProps<T extends FieldValues> {
  /** 表单默认值 */
  defaultValues?: UseFormProps<T>['defaultValues'];
  /** 表单验证Schema */
  schema?: z.ZodType<T>;
  /** 提交处理函数 */
  onSubmit: (data: T) => void | Promise<void>;
  /** 提交失败处理函数 */
  onError?: (error: any) => void;
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

/** 表单组件 */
export function Form<T extends FieldValues>({
  defaultValues,
  schema,
  onSubmit,
  onError,
  children,
  className = ''
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined
  });

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(handleSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}

/** 表单项组件Props */
export interface FormItemProps {
  /** 标签文本 */
  label?: string;
  /** 是否必填 */
  required?: boolean;
  /** 错误信息 */
  error?: string;
  /** 帮助文本 */
  helpText?: string;
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

/** 表单项组件 */
export const FormItem: React.FC<FormItemProps> = ({
  label,
  required,
  error,
  helpText,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
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

/** 表单错误信息组件Props */
export interface FormErrorProps {
  /** 错误信息 */
  error?: string;
  /** 自定义类名 */
  className?: string;
}

/** 表单错误信息组件 */
export const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`text-red-500 text-sm mt-1 ${className}`}>
      {error}
    </div>
  );
}; 