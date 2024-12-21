import React from 'react';

import { List, Text, useTheme, Divider } from 'react-native-paper';
import { View, StyleSheet, FlatList } from 'react-native';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface INotification {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** type 的描述 */
  type: 'info' | 'warning' | 'success';
  /** createdAt 的描述 */
  createdAt: Date;
  /** read 的描述 */
  read: boolean;
}

interface INotificationListProps {
  /** notifications 的描述 */
  notifications: INotification[];
  /** onNotificationPress 的描述 */
  onNotificationPress: (notification: INotification) => void;
}

export const NotificationList = ({
  notifications,
  onNotificationPress,
}: INotificationListProps) => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: INotification }) => (
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
      style={[styles.item, !item.read && { backgroundColor: theme.colors.primary + '10' }]}
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
