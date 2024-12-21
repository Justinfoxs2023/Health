import React from 'react';

import { ResponsiveLayout } from '@design/layout/ResponsiveLayout';
import { View, StyleSheet, ViewProps, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IContainerProps extends ViewProps {
  /** fluid 的描述 */
  fluid?: boolean;
  /** centered 的描述 */
  centered?: boolean;
  /** safeArea 的描述 */
  safeArea?: boolean;
  /** maxWidth 的描述 */
  maxWidth?: keyof typeof ResponsiveLayout.breakpoints;
}

export const Container: React.FC<IContainerProps> = ({
  children,
  fluid = false,
  centered = true,
  safeArea = true,
  maxWidth = 'lg',
  style,
  ...props
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    safeArea && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    !fluid && {
      maxWidth: ResponsiveLayout.getLayoutConfig({
        [maxWidth]: ResponsiveLayout.breakpoints[maxWidth],
        default: width,
      }),
    },
    centered && styles.centered,
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  centered: {
    alignItems: 'center',
  },
});
