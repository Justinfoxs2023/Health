import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';

interface Props {
  user: {
    id: string;
    avatar: string;
    name: string;
    title?: string;
    verified?: boolean;
  };
  size?: 'small' | 'medium' | 'large';
}

export const UserInfo: React.FC<Props> = ({
  user,
  size = 'medium'
}) => {
  const getAvatarSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 48;
      default:
        return 40;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 16;
      default:
        return 14;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.avatar }}
        style={[styles.avatar, { width: getAvatarSize(), height: getAvatarSize() }]}
      />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { fontSize: getFontSize() }]}>
            {user.name}
          </Text>
          {user.verified && (
            <Icon name="verified" size={16} color="#2E7D32" style={styles.verifiedIcon} />
          )}
        </View>
        {user.title && (
          <Text style={[styles.title, { fontSize: getFontSize() - 2 }]}>
            {user.title}
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
    borderRadius: 20,
    marginRight: 8
  },
  info: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontWeight: '500',
    color: '#333'
  },
  verifiedIcon: {
    marginLeft: 4
  },
  title: {
    color: '#666',
    marginTop: 2
  }
}); 