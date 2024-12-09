import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { DesignTokens } from '../../../tokens';

interface GradientBackgroundProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  intensity?: 'light' | 'medium' | 'strong';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
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
      strong: ['0.2', '0.3']
    }[intensity];

    return [
      `${baseColor}${alpha[0]}`,
      `${baseColor}${alpha[1]}`
    ];
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={[styles.gradient, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%'
  }
}); 