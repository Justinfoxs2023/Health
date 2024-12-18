import React, { useEffect, useRef } from 'react';

import { View, StyleSheet, Animated } from 'react-native';

export const VoiceWaveform: React.FC = () => {
  const bars = new Array(20).fill(0);
  const animations = useRef(bars.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animate = () => {
      const animationSequence = animations.map(anim => {
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random(),
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.stagger(100, animationSequence).start(() => animate());
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              transform: [
                {
                  scaleY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginTop: 10,
  },
  bar: {
    width: 3,
    height: 20,
    backgroundColor: '#2E7D32',
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
});
