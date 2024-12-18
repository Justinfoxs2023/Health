import React from 'react';

import { Icon } from './Icon';
import { TouchableOpacity, Share, StyleSheet } from 'react-native';

interface IProps {
  /** title 的描述 */
  title: string;
  /** url 的描述 */
  url: string;
}

export const ShareButton: React.FC<IProps> = ({ title, url }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n${url}`,
        title: title,
      });
    } catch (error) {
      console.error('Error in ShareButton.tsx:', '分享失败:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleShare}>
      <Icon name="share" size={24} color="#666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
