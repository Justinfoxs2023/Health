import React from 'react';

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface IProps {
  /** author 的描述 */
  author: {
    id: string;
    name: string;
    avatar: string;
    title?: string;
  };
  /** date 的描述 */
  date?: string;
  /** onPress 的描述 */
  onPress?: () => void;
}

export const AuthorInfo: React.FC<IProps> = ({ author, date, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      <Image source={{ uri: author.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{author.name}</Text>
        {author.title && <Text style={styles.title}>{author.title}</Text>}
        {date && <Text style={styles.date}>{date}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
