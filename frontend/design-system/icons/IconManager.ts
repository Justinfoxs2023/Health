import { ImageSourcePropType } from 'react-native';

// 图标资源类型定义
export type IconName = 
  | 'home' 
  | 'profile' 
  | 'settings'
  | 'heart'
  | 'activity'
  | 'nutrition'
  | 'sleep'
  | 'more';

// 图标分类定义
export type IconCategory = 
  | 'navigation'
  | 'health'
  | 'activity'
  | 'status'
  | 'common';

// 图标信息接口
interface IconInfo {
  category: IconCategory;
  source: ImageSourcePropType;
  tags?: string[];
}

// 图标资源映射
export const IconResources: Record<IconName, IconInfo> = {
  home: {
    category: 'navigation',
    source: require('../assets/icons/navigation/home.png'),
    tags: ['首页', '导航']
  },
  profile: {
    category: 'navigation',
    source: require('../assets/icons/navigation/profile.png'),
    tags: ['个人', '用户']
  },
  settings: {
    category: 'navigation',
    source: require('../assets/icons/navigation/settings.png'),
    tags: ['设置', '配置']
  },
  heart: {
    category: 'health',
    source: require('../assets/icons/health/heart.png'),
    tags: ['心率', '健康']
  },
  activity: {
    category: 'activity',
    source: require('../assets/icons/activity/activity.png'),
    tags: ['运动', '活动']
  },
  nutrition: {
    category: 'health',
    source: require('../assets/icons/health/nutrition.png'),
    tags: ['营养', '饮食']
  },
  sleep: {
    category: 'health',
    source: require('../assets/icons/health/sleep.png'),
    tags: ['睡眠', '休息']
  },
  more: {
    category: 'common',
    source: require('../assets/icons/common/more.png'),
    tags: ['更多', '菜单']
  }
}; 