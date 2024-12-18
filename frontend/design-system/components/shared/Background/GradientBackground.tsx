import React from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { DesignTokens } from '../../../tokens';
import { StyleSheet, ViewProps } from 'react-native';

interface IGradientBackgroundProps extends ViewProps {
  /** variant 的描述 */
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  /** intensity 的描述 */
  intensity?: 'light' | 'medium' | 'strong';
}

export const GradientBackground: React.FC<IGradientBackgroundProps> = ({
  children,
  variant = 'primary',
  intensity = 'medium',
  style,
  ...props
}) => {
  const getGradientColors = () => {
    const baseColor = DesignTokens.colors.brand[variant];
    const alpha = {
      light: ['0.05', '0.1'],
      medium: ['0.1', '0.2'],
      strong: ['0.2', '0.3'],
    }[intensity];

    return [`${baseColor}${alpha[0]}`, `${baseColor}${alpha[1]}`];
  };

  return (
    <LinearGradient colors={getGradientColors()} style={[styles.gradient, style]} {...props}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
  },
});
