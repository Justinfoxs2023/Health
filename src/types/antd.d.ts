declare module 'antd' {
  export const message: {
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
    info: (content: string) => void;
  };

  export class Tabs extends React.Component<{
    defaultActiveKey?: string;
    centered?: boolean;
    className?: string;
    children?: React.ReactNode;
  }> {
    static TabPane: React.FC<{
      tab: string;
      key: string;
      children?: React.ReactNode;
    }>;
  }

  export const Tooltip: React.FC<{
    title: string;
    children: React.ReactNode;
  }>;

  export const Modal: React.FC<{
    title?: string;
    open?: boolean;
    onCancel?: () => void;
    footer?: React.ReactNode | null;
    centered?: boolean;
    width?: number;
    className?: string;
    children?: React.ReactNode;
  }>;

  export const Spin: React.FC<{
    size?: 'small' | 'default' | 'large';
    tip?: string;
  }>;

  export const Button: React.FC<{
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    size?: 'small' | 'middle' | 'large';
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
  }>;

  export const QRCode: React.FC<{
    value: string;
    size?: number;
    style?: React.CSSProperties;
  }>;

  export const Space: React.FC<{
    size?: 'small' | 'middle' | 'large' | number;
    align?: 'start' | 'end' | 'center' | 'baseline';
    direction?: 'vertical' | 'horizontal';
    wrap?: boolean;
    children?: React.ReactNode;
  }>;
} 