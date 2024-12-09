import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Props {
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp?: string;
}

export const AuthorInfo: React.FC<Props> = ({ author, timestamp }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: author.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{author.name}</Text>
        {timestamp && (
          <Text style={styles.time}>
            {format(new Date(timestamp), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 2
  }
}); 