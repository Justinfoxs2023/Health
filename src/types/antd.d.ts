/**
 * @fileoverview TS 文件 antd.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'antd' {
  export const Row: React.FC<{
    gutter?: number | [number, number];
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
    align?: 'top' | 'middle' | 'bottom';
    children: React.ReactNode;
  }>;

  export const Col: React.FC<{
    span?: number;
    xs?: number | object;
    sm?: number | object;
    md?: number | object;
    lg?: number | object;
    xl?: number | object;
    children: React.ReactNode;
  }>;

  export const Card: React.FC<{
    title?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
  }>;

  export const Empty: React.FC<{
    description?: React.ReactNode;
  }>;

  export const Spin: React.FC<{
    size?: 'small' | 'default' | 'large';
    tip?: string;
  }>;

  export const message: {
    success: (content: string) => void;
    error: (content: string) => void;
  };

  export const Tabs: React.FC<{
    defaultActiveKey?: string;
    children: React.ReactNode;
  }> & {
    TabPane: React.FC<{
      tab: React.ReactNode;
      key: string;
      children: React.ReactNode;
    }>;
  };
}
