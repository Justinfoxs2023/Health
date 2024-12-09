import React from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { DesignTokens } from '../../tokens';
import { CustomIcon } from '../../icons';

interface LoadingStatesProps {
  type?: 'spinner' | 'skeleton' | 'progress' | 'shimmer';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  style?: ViewStyle;
  color?: string;
  fullscreen?: boolean;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type = 'spinner',
  size = 'medium',
  text,
  style,
  color = DesignTokens.colors.brand.primary,
  fullscreen = false
}) => {
  const spinAnimation = React.useRef(new Animated.Value(0)).current;
  const shimmerAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (type === 'spinner') {
      Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ).start();
    } else if (type === 'shimmer') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [type]);

  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 36;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'spinner':
        return (
          <Animated.View
            style={[
              styles.spinner,
              {
                width: getSize(),
                height: getSize(),
                borderColor: color,
                transform: [{
                  rotate: spinAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}
          />
        );

      case 'skeleton':
        return (
          <View style={styles.skeletonContainer}>
            <View style={[styles.skeletonLine, { width: '60%' }]} />
            <View style={[styles.skeletonLine, { width: '80%' }]} />
            <View style={[styles.skeletonLine, { width: '40%' }]} />
          </View>
        );

      case 'progress':
        return (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: color }
                ]}
              />
            </View>
            {text && <Text style={styles.progressText}>{text}</Text>}
          </View>
        );

      case 'shimmer':
        return (
          <Animated.View
            style={[
              styles.shimmerContainer,
              {
                opacity: shimmerAnimation
              }
            ]}
          >
            <View style={styles.shimmerContent} />
          </Animated.View>
        );
    }
  };

  return (
    <View style={[
      styles.container,
      fullscreen && styles.fullscreen,
      style
    ]}>
      {renderContent()}
      {text && type !== 'progress' && (
        <Text style={[styles.text, { color }]}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: DesignTokens.spacing.md
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 50,
    borderTopColor: 'transparent'
  },
  text: {
    marginTop: DesignTokens.spacing.sm,
    fontSize: DesignTokens.typography.sizes.sm,
    fontWeight: String(DesignTokens.typography.weights.medium)
  },
  skeletonContainer: {
    width: '100%',
    gap: DesignTokens.spacing.sm
  },
  skeletonLine: {
    height: 12,
    backgroundColor: DesignTokens.colors.neutral.gray[200],
    borderRadius: DesignTokens.radius.sm
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center'
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: DesignTokens.colors.neutral.gray[200],
    borderRadius: DesignTokens.radius.full,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    width: '60%'
  },
  progressText: {
    marginTop: DesignTokens.spacing.xs,
    fontSize: DesignTokens.typography.sizes.sm,
    color: DesignTokens.colors.text.secondary
  },
  shimmerContainer: {
    width: '100%',
    overflow: 'hidden'
  },
  shimmerContent: {
    height: 200,
    backgroundColor: DesignTokens.colors.neutral.gray[100]
  }
}); 