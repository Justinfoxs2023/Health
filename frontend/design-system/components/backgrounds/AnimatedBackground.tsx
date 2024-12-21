import React from 'react';

import { ColorTokens } from '../../styles/colors/colorTokens';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

interface IAnimatedBackgroundProps {
  /** children 的描述 */
  children: React.ReactNode;
  /** variant 的描述 */
  variant?: 'default' | 'wave' | 'bubble';
}

export const AnimatedBackground: React.FC<IAnimatedBackgroundProps> = ({
  children,
  variant = 'default',
}) => {
  const { width, height } = Dimensions.get('window');
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const renderBackground = () => {
    switch (variant) {
      case 'wave':
        return (
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -height * 0.2],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      case 'bubble':
        return Array(5)
          .fill(0)
          .map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.bubble,
                {
                  left: `${20 * (i + 1)}%`,
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, -100],
                      }),
                    },
                  ],
                },
              ]}
            />
          ));
      default:
        return (
          <Animated.View
            style={[
              styles.default,
              {
                transform: [
                  {
                    rotate: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderBackground()}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  default: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: ColorTokens.vibrant.primary.lightest,
    top: -width,
    left: -width / 2,
  },
  wave: {
    position: 'absolute',
    width: width * 2,
    height: height * 1.5,
    backgroundColor: ColorTokens.vibrant.primary.lightest,
    borderRadius: width,
    top: height * 0.2,
    left: -width / 2,
  },
  bubble: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: ColorTokens.vibrant.primary.lightest,
    opacity: 0.5,
  },
});
