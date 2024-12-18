import React from 'react';

import { Text, Icon, Badge } from '../common';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface IProps {
  /** device 的描述 */
  device: {
    id: string;
    name: string;
    status: 'connected' | 'disconnected' | 'pairing';
    batteryLevel?: number;
  };
  /** icon 的描述 */
  icon: {
    name: string;
    color: string;
  };
  /** onPress 的描述 */
  onPress: () => void;
  /** onConnect 的描述 */
  onConnect: () => void;
  /** onSync 的描述 */
  onSync: () => void;
}

export const DeviceCard: React.FC<IProps> = ({ device, icon, onPress, onConnect, onSync }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          color: '#66BB6A',
          text: '已连接',
          icon: 'bluetooth-connected',
        };
      case 'pairing':
        return {
          color: '#42A5F5',
          text: '配对中',
          icon: 'bluetooth-searching',
        };
      default:
        return {
          color: '#999',
          text: '未连接',
          icon: 'bluetooth-disabled',
        };
    }
  };

  const statusConfig = getStatusConfig(device.status);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Icon name={icon.name} size={24} color={icon.color} />
        <Badge color={statusConfig.color} icon={statusConfig.icon} text={statusConfig.text} />
      </View>

      <Text style={styles.deviceName}>{device.name}</Text>

      {device.batteryLevel !== undefined && (
        <View style={styles.batteryInfo}>
          <Icon
            name={device.batteryLevel > 20 ? 'battery-std' : 'battery-alert'}
            size={16}
            color={device.batteryLevel > 20 ? '#66BB6A' : '#EF5350'}
          />
          <Text style={styles.batteryText}>{device.batteryLevel}%</Text>
        </View>
      )}

      <View style={styles.actions}>
        {device.status === 'disconnected' ? (
          <TouchableOpacity style={styles.actionButton} onPress={onConnect}>
            <Icon name="bluetooth" size={20} color="#2E7D32" />
            <Text style={styles.actionText}>连接</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={onSync}>
            <Icon name="sync" size={20} color="#2E7D32" />
            <Text style={styles.actionText}>同步</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  batteryText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
});
