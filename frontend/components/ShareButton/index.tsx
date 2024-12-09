import React from 'react';
import { TouchableOpacity, Share, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  title: string;
  url: string;
  size?: 'small' | 'medium' | 'large';
}

export const ShareButton: React.FC<Props> = ({
  title,
  url,
  size = 'medium'
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        title,
        message: url
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const iconSize = {
    small: 16,
    medium: 20,
    large: 24
  }[size];

  return (
    <TouchableOpacity style={styles.container} onPress={handleShare}>
      <Icon name="share" size={iconSize} color="#666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8
  }
}); 