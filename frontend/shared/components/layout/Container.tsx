import React from 'react';
import { View, StyleSheet, ViewProps, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ResponsiveLayout } from '@design/layout/ResponsiveLayout';

interface ContainerProps extends ViewProps {
  fluid?: boolean;
  centered?: boolean;
  safeArea?: boolean;
  maxWidth?: keyof typeof ResponsiveLayout.breakpoints;
}

export const Container: React.FC<ContainerProps> = ({
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
      paddingRight: insets.right
    },
    !fluid && {
      maxWidth: ResponsiveLayout.getLayoutConfig({
        [maxWidth]: ResponsiveLayout.breakpoints[maxWidth],
        default: width
      })
    },
    centered && styles.centered,
    style
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
    width: '100%'
  },
  centered: {
    alignItems: 'center'
  }
}); 