import React from 'react';

import { Text as RNText, TextProps, StyleSheet } from 'react-native';

export const Text: React.FC<TextProps> = ({ style, ...props }) => {
  return <RNText style={[styles.text, style]} {...props} />;
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
});
