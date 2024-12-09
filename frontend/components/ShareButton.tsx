import React from 'react';
import { TouchableOpacity, Share, StyleSheet } from 'react-native';
import { Icon } from './Icon';

interface Props {
  title: string;
  url: string;
}

export const ShareButton: React.FC<Props> = ({ title, url }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n${url}`,
        title: title
      });
    } catch (error) {
      console.error('分享失败:', error);
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
    padding: 8
  }
}); 