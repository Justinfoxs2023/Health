import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Text, useTheme, Divider } from 'react-native-paper';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  createdAt: Date;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onNotificationPress: (notification: Notification) => void;
}

export const NotificationList = ({ notifications, onNotificationPress }: NotificationListProps) => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: Notification }) => (
    <List.Item
      title={item.title}
      description={item.content}
      left={props => (
        <List.Icon
          {...props}
          icon={
            item.type === 'warning'
              ? 'alert'
              : item.type === 'success'
              ? 'check-circle'
              : 'information'
          }
          color={
            item.type === 'warning'
              ? theme.colors.error
              : item.type === 'success'
              ? theme.colors.success
              : theme.colors.primary
          }
        />
      )}
      right={props => (
        <Text {...props} style={[props.style, styles.time]}>
          {format(item.createdAt, 'MM-dd HH:mm', { locale: zhCN })}
        </Text>
      )}
      onPress={() => onNotificationPress(item)}
      style={[
        styles.item,
        !item.read && { backgroundColor: theme.colors.primary + '10' },
      ]}
    />
  );

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => <Divider />}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  item: {
    paddingVertical: 8,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
}); 