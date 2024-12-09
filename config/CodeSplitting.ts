import { RouteObject } from 'react-router-dom';

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    component: () => import('@/pages/Home'),
    chunks: ['home'],
    priority: 'high'
  },
  {
    path: '/dashboard',
    component: () => import('@/pages/Dashboard'),
    chunks: ['dashboard'],
    priority: 'high'
  },
  {
    path: '/health-records',
    component: () => import('@/pages/HealthRecords'),
    chunks: ['health-records'],
    priority: 'medium',
    preload: true
  }
];

export const componentSplitting = {
  // 异步组件配置
  asyncComponents: {
    'DataVisualization': {
      loader: () => import('@/components/DataVisualization'),
      chunkName: 'data-viz'
    },
    'HealthMetrics': {
      loader: () => import('@/components/HealthMetrics'),
      chunkName: 'health-metrics'
    }
  },
  
  // 公共模块提取
  commonChunks: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      chunks: 'all'
    },
    common: {
      name: 'common',
      minChunks: 2,
      chunks: 'all',
      priority: -20
    }
  }
}; 