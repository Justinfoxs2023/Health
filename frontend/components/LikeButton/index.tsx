import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  count: number;
  liked?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const LikeButton: React.FC<Props> = ({
  count,
  liked = false,
  onPress,
  size = 'medium'
}) => {
  const iconSize = {
    small: 16,
    medium: 20,
    large: 24
  }[size];

  const textSize = {
    small: 12,
    medium: 14,
    large: 16
  }[size];

  return (
    <TouchableOpacity
      style={[styles.container, liked && styles.liked]}
      onPress={onPress}
    >
      <Icon
        name={liked ? 'favorite' : 'favorite-border'}
        size={iconSize}
        color={liked ? '#f44336' : '#666'}
      />
      <Text
        style={[
          styles.count,
          { fontSize: textSize },
          liked && styles.likedText
        ]}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  liked: {
    opacity: 0.8
  },
  count: {
    marginLeft: 4,
    color: '#666'
  },
  likedText: {
    color: '#f44336'
  }
}); 