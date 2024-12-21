export interface HealthCheckConfig {
  tsconfig: string;
  include: string[];
  exclude: string[];
  rules: {
    [key: string]: 'error' | 'warning' | 'off';
  };
  fixers: {
    [key: string]: boolean;
  };
}

export const defaultConfig: HealthCheckConfig = {
  tsconfig: 'tsconfig.json',
  include: ['src/**/*.ts', 'scripts/**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  rules: {
    'unused-code': 'error',
    'type-error': 'error',
    'style-issue': 'warning',
    'performance-issue': 'warning',
    'security-issue': 'error'
  },
  fixers: {
    'unused-code': true,
    'type-error': true,
    'style-issue': true
  }
}; 