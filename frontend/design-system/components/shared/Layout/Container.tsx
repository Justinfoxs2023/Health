import React from 'react';
import { View, StyleSheet, ViewProps, useWindowDimensions } from 'react-native';
import { DesignTokens } from '../../../tokens';
import { ThemeConfig } from '../../../theme/theme.config';

interface ContainerProps extends ViewProps {
  maxWidth?: keyof typeof ThemeConfig.breakpoints;
  fluid?: boolean;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  fluid = false,
  centered = true,
  style,
  ...props
}) => {
  const { width } = useWindowDimensions();

  const getMaxWidth = () => {
    if (fluid) return '100%';
    return width > ThemeConfig.breakpoints[maxWidth]
      ? ThemeConfig.breakpoints[maxWidth]
      : '100%';
  };

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: getMaxWidth(),
          alignItems: centered ? 'center' : 'flex-start'
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: DesignTokens.spacing.md,
    alignSelf: 'center'
  }
}); 