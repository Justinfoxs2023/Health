import React from 'react';

import { Icon } from './Icon';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IProps {
  /** liked 的描述 */
  liked: boolean;
  /** count 的描述 */
  count: number;
  /** onPress 的描述 */
  onPress: () => void;
  /** size 的描述 */
  size?: number;
}

export const LikeButton: React.FC<IProps> = ({ liked, count, onPress, size = 24 }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon
        name={liked ? 'favorite' : 'favorite-border'}
        size={size}
        color={liked ? '#F44336' : '#666'}
      />
      {count > 0 && <Text style={[styles.count, liked && styles.likedCount]}>{count}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  count: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  likedCount: {
    color: '#F44336',
  },
});
