import React from 'react';

import { IconNameType, IconResources } from '../../icons/IconManager';
import { Image, ImageStyle, StyleSheet } from 'react-native';

interface IconProps {
  /** name 的描述 */
  name: IconNameType;
  /** size 的描述 */
  size?: number;
  /** color 的描述 */
  color?: string;
  /** style 的描述 */
  style?: ImageStyle;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => {
  return (
    <Image
      source={IconResources[name].source}
      style={[
        styles.icon,
        {
          width: size,
          height: size,
          tintColor: color,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});
