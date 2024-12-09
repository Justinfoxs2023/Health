import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DesignTokens } from '../../../tokens';

interface WaveEffectProps {
  color?: string;
  height?: number;
  amplitude?: number;
  frequency?: number;
}

export const WaveEffect: React.FC<WaveEffectProps> = ({
  color = DesignTokens.colors.brand.primary,
  height = 100,
  amplitude = 20,
  frequency = 2
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const createWavePath = (offset: number) => {
    const width = 100;
    let path = `M 0 ${height}`;

    for (let i = 0; i <= width; i++) {
      const x = i;
      const y = amplitude * Math.sin((i / width) * Math.PI * frequency + offset) + height / 2;
      path += ` L ${x} ${y}`;
    }

    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  };

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View
        style={[
          styles.wave,
          {
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -100]
                })
              }
            ]
          }
        ]}
      >
        <Svg width="200%" height="100%" viewBox="0 0 100 100">
          <Path d={createWavePath(0)} fill={color} opacity={0.4} />
          <Path d={createWavePath(Math.PI)} fill={color} opacity={0.2} />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden'
  },
  wave: {
    width: '200%',
    aspectRatio: 1,
    position: 'absolute'
  }
}); 