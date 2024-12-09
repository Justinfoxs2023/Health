import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  user: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  showRole?: boolean;
  timestamp?: string;
}

export const UserInfo: React.FC<Props> = ({ user, showRole, timestamp }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}</Text>
          {showRole && user.role && (
            <Text style={styles.role}>{user.role}</Text>
          )}
        </View>
        {timestamp && <Text style={styles.time}>{timestamp}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  info: {
    marginLeft: 12,
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333'
  },
  role: {
    fontSize: 12,
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4
  }
}); 