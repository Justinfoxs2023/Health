import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, Share, StyleSheet } from 'react-native';

interface IProps {
  /** title 的描述 */
  title: string;
  /** url 的描述 */
  url: string;
  /** size 的描述 */
  size?: 'small' | 'medium' | 'large';
}

export const ShareButton: React.FC<IProps> = ({ title, url, size = 'medium' }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        title,
        message: url,
      });
    } catch (error) {
      console.error('Error in index.tsx:', 'Share failed:', error);
    }
  };

  const iconSize = {
    small: 16,
    medium: 20,
    large: 24,
  }[size];

  return (
    <TouchableOpacity style={styles.container} onPress={handleShare}>
      <Icon name="share" size={iconSize} color="#666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
