import React from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';
import { IconName, IconResources } from '../../icons/IconManager';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ImageStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style
}) => {
  return (
    <Image
      source={IconResources[name].source}
      style={[
        styles.icon,
        {
          width: size,
          height: size,
          tintColor: color
        },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain'
  }
}); 