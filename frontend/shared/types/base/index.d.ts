// 基础类型定义
export interface Dict {
  [key: string]: any;
}

// Express扩展
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
        permissions?: string[];
      };
      body: any;
      query: any;
      params: any;
      headers: {
        authorization?: string;
        [key: string]: any;
      };
      file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
      };
    }

    interface Response {
      status(code: number): this;
      json(body: {
        code: number;
        data?: any;
        message?: string;
      }): this;
    }
  }
}

// 设计系统类型
export interface DesignTokens {
  colors: {
    brand: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    background: {
      paper: string;
      default: string;
      secondary: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    functional: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    neutral: {
      white: string;
      black: string;
      gray: Record<string, string>;
    };
  };
  spacing: Record<string, number>;
  radius: Record<string, number>;
  typography: {
    sizes: Record<string, number>;
    weights: Record<string, number>;
  };
  shadows: Record<string, any>;
}

// 组件主题类型
export interface ComponentTheme {
  colors: DesignTokens['colors'];
  spacing: DesignTokens['spacing'];
  radius: DesignTokens['radius'];
  typography: DesignTokens['typography'];
  shadows: DesignTokens['shadows'];
}

// 主题配置类型
export interface ThemeConfig {
  mode: 'light' | 'dark';
  tokens: DesignTokens;
} 