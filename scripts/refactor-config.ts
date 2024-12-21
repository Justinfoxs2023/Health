import path from 'path';
import { IRefactorConfig, ServiceType } from '../src/core/types/refactor.types';

export const refactorConfig: IRefactorConfig = {
  corePath: path.resolve('src/core'),

  // 核心目录结构
  directories: [
    'services',
    'common/interfaces',
    'common/services',
    'infrastructure/monitoring',
    'infrastructure/logger',
    'infrastructure/cache',
    'types',
  ],

  // 文件迁移映射
  pathMappings: [
    {
      oldPath: 'src/services',
      newPath: 'src/core/services',
      patterns: ['**/*.ts', '**/*.tsx'],
    },
    {
      oldPath: 'src/common',
      newPath: 'src/core/common',
      patterns: ['**/*.ts', '**/*.tsx'],
    },
    {
      oldPath: 'src/infrastructure',
      newPath: 'src/core/infrastructure',
      patterns: ['**/*.ts', '**/*.tsx'],
    },
  ],

  // 重构规则
  rules: [
    // 更新导入路径
    {
      patterns: ['src/**/*.ts', 'src/**/*.tsx'],
      replacements: [
        {
          from: /from ['"]@\/services\/(.*)['"]/g,
          to: "from '@/core/services/$1'",
        },
        {
          from: /from ['"]@\/common\/(.*)['"]/g,
          to: "from '@/core/common/$1'",
        },
        {
          from: /from ['"]@\/infrastructure\/(.*)['"]/g,
          to: "from '@/core/infrastructure/$1'",
        },
      ],
    },
    // 更新服务类名
    {
      patterns: ['src/core/services/**/*.ts'],
      replacements: [
        {
          from: /class (\w+)Service/g,
          to: 'class $1CoreService',
        },
      ],
    },
  ],
};
