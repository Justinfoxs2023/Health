import React from 'react';

import { LoadingSpinner, Icon, EmptyState } from '../../components';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getNotifications, markAsRead } from '../../api/notification';
import { useQuery } from 'react-query';

interface INotification {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** isRead 的描述 */
  isRead: boolean;
  /** createdAt 的描述 */
  createdAt: string;
}

export const NotificationScreen = ({ navigation }) => {
  const { data, isLoading, refetch } = useQuery('notifications', getNotifications);

  const handleNotificationPress = async (notification: INotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      refetch();
    }

    // 根据不同类型的通知导航到不同页面
    switch (notification.type) {
      case 'appointment':
        navigation.navigate('AppointmentDetail', { id: notification.referenceId });
        break;
      case 'consultation':
        navigation.navigate('ConsultationDetail', { id: notification.referenceId });
        break;
      case 'healthRisk':
        navigation.navigate('HealthRiskDetail', { id: notification.referenceId });
        break;
      default:
        break;
    }
  };

  const renderNotification = ({ item }: { item: INotification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unread]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIcon}>
        <Icon name={getIconName(item.type)} size={24} color={getIconColor(item.type)} />
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState icon="bell" title="暂无通知" description="您目前没有任何通知消息" />
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
};

const getIconName = (type: string) => {
  switch (type) {
    case 'appointment':
      return 'calendar';
    case 'consultation':
      return 'message-square';
    case 'healthRisk':
      return 'alert-triangle';
    default:
      return 'bell';
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'appointment':
      return '#2E7D32';
    case 'consultation':
      return '#1976D2';
    case 'healthRisk':
      return '#D32F2F';
    default:
      return '#757575';
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    // 1分钟内
    return '刚刚';
  } else if (diff < 3600000) {
    // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    // 1天内
    return `${Math.floor(diff / 3600000)}小时前`;
  } else if (diff < 604800000) {
    // 1周内
    return `${Math.floor(diff / 86400000)}天前`;
  } else {
    return date.toLocaleDateString();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  unread: {
    backgroundColor: '#F5F9FF',
  },
  notificationIcon: {
    position: 'relative',
    width: 40,
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 10,
  },
});
