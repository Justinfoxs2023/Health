/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const Colors = {
  primary: '#2E7D32',
  secondary: '#0288D1',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#43A047',
};

export const Typography = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
  },
};

export const Spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
};
