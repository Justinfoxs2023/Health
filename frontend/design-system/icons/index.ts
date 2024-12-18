import icoMoonConfig from './selection.json';
import { TextProps } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

// 定义图标Props接口
interface IconProps extends TextProps {
  /** name 的描述 */
  name: string;
  /** size 的描述 */
  size?: number;
  /** color 的描述 */
  color?: string;
}

// 创建自定义图标集
export const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'health-icons',
  'health-icons.ttf',
);

// 图标类型定义
export type IconNameType = keyof typeof icoMoonConfig.icons;

// 导出自定义图标Props类型
export interface ICustomIconProps extends Omit<IconProps, 'name'> {
  /** name 的描述 */
  name: IconNameType;
}

// 图标分类
export const IconTypes = {
  // 导航图标
  navigation: {
    home: 'home',
    profile: 'user',
    settings: 'settings',
    back: 'arrow-left',
  },

  // 健康相关图标
  health: {
    heartRate: 'heart-pulse',
    bloodPressure: 'blood-pressure',
    weight: 'weight-scale',
    sleep: 'moon',
  },

  // 功能图标
  function: {
    add: 'plus',
    edit: 'edit',
    delete: 'trash',
    search: 'search',
  },

  // 状态图标
  status: {
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle',
    info: 'info',
  },
} as const;

// 导出图标类型
export type IconTypesType = typeof IconTypes;
