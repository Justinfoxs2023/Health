import React from 'react';

import { Text, Icon } from '../common';
import { View, StyleSheet } from 'react-native';

interface IProps {
  /** status 的描述 */
  status: 'syncing' | 'synced' | 'error';
  /** lastSyncTime 的描述 */
  lastSyncTime?: string;
  /** progress 的描述 */
  progress?: number;
}

export const DataSyncStatus: React.FC<IProps> = ({ status, lastSyncTime, progress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Icon
          name={status === 'synced' ? 'check-circle' : 'sync'}
          color={status === 'synced' ? '#4CAF50' : status === 'syncing' ? '#2196F3' : '#F44336'}
          size={18}
        />
        <Text style={styles.statusText}>
          {status === 'synced' ? '已同步' : status === 'syncing' ? '正在同步...' : '同步错误'}
        </Text>
      </View>

      {progress !== undefined && status === 'syncing' && (
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
      )}

      {lastSyncTime && <Text style={styles.timeText}>上次同步: {lastSyncTime}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginTop: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
});
