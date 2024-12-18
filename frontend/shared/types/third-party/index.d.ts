/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// LinearGradient类型定义
declare module 'react-native-linear-gradient' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
    useAngle?: boolean;
    angle?: number;
    angleCenter?: { x: number; y: number };
  }

  export default class LinearGradient extends React.Component<LinearGradientProps> {}
}

// Vector Icons类型定义
declare module 'react-native-vector-icons/MaterialIcons' {
  import React from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
    allowFontScaling?: boolean;
  }

  export default class Icon extends React.Component<IconProps> {
    static getImageSource(name: string, size?: number, color?: string): Promise<any>;
    static loadFont(file?: string): Promise<void>;
    static hasIcon(name: string): boolean;
  }
}

// Chart Kit类型定义
declare module 'react-native-chart-kit' {
  import React from 'react';
  import { ViewStyle } from 'react-native';

  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    color?: (opacity?: number) => string;
    strokeWidth?: number;
    barPercentage?: number;
    useShadowColorFromDataset?: boolean;
    decimalPlaces?: number;
    style?: ViewStyle;
  }

  export interface LineChartData {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity?: number) => string;
      strokeWidth?: number;
    }[];
  }

  export interface LineChartProps {
    data: LineChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: ViewStyle;
    withDots?: boolean;
    withShadow?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    withHorizontalLines?: boolean;
    withVerticalLines?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
  }

  export class LineChart extends React.Component<LineChartProps> {}
  export class BarChart extends React.Component<LineChartProps> {}
}

declare module '@tensorflow/tfjs' {
  export interface LayersModel {
    predict(inputs: any): any;
    compile(config: any): void;
    fit(x: any, y: any, config?: any): Promise<any>;
  }

  export const layers: {
    dense: (config: any) => any;
    dropout: (config: any) => any;
  };

  export const sequential: () => any;
  export const callbacks: {
    earlyStopping: (config: any) => any;
    modelCheckpoint: (config: any) => any;
  };
}

declare module 'react-redux' {
  export function useDispatch(): any;
  export function useSelector<T = any>(selector: (state: any) => T): T;
  export const Provider: React.ComponentType<{ store: any }>;
}

declare module '@reduxjs/toolkit' {
  export function configureStore(options: any): any;
  export function createSlice(options: any): any;
  export function createAsyncThunk(
    type: string,
    payloadCreator: (...args: any[]) => Promise<any>,
  ): any;
}

declare module 'react-native-svg' {
  export interface SvgProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    fill?: string;
    stroke?: string;
  }

  export const Svg: React.ComponentType<SvgProps>;
  export const Path: React.ComponentType<any>;
  export const Circle: React.ComponentType<any>;
  export const Rect: React.ComponentType<any>;
}
