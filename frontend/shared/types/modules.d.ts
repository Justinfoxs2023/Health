// 声明所有模块
declare module '*';

// 声明第三方库模块
declare module 'joi';
declare module 'fs-extra';
declare module '@jest/types';
declare module 'react-native-svg';
declare module '@tensorflow/tfjs';
declare module '@reduxjs/toolkit';
declare module 'react-redux';
declare module 'react-native-reanimated';
declare module 'react-native-gesture-handler';
declare module '@react-navigation/native';
declare module '@react-navigation/stack';
declare module 'react-native-safe-area-context';
declare module 'react-native-vector-icons/*';
declare module 'react-native-charts-wrapper';
declare module 'react-native-svg-charts';
declare module 'react-native-sound';
declare module 'react-native-keyboard-aware-scroll-view';

// 声明本地模块
declare module '../*';
declare module './*';
declare module '@/*';
declare module '@components/*';
declare module '@utils/*';
declare module '@services/*';
declare module '@models/*';
declare module '@types/*';
declare module '@design/*';

// 声明图片资源
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

// 声明样式文件
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// 声明配置文件
declare module '*.json' {
  const content: any;
  export default content;
}

declare module '*.yml' {
  const content: any;
  export default content;
} 