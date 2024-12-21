import React from 'react';

import { Card, Text, Icon, Badge, Button } from '../common';
import { View, StyleSheet, FlatList } from 'react-native';

interface IVaccineRecord {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** date 的描述 */
  date: string;
  /** status 的描述 */
  status: 'completed' | 'scheduled' | 'overdue';
  /** nextDose 的描述 */
  nextDose?: {
    date: string;
    type: string;
  };
  /** notes 的描述 */
  notes?: string;
  /** provider 的描述 */
  provider: string;
}

interface IProps {
  /** memberId 的描述 */
  memberId: string;
  /** onSchedule 的描述 */
  onSchedule?: () => void;
}

export const VaccinationRecord: React.FC<IProps> = ({ memberId, onSchedule }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: '#66BB6A',
          text: '已完成',
          icon: 'check-circle',
        };
      case 'scheduled':
        return {
          color: '#42A5F5',
          text: '已预约',
          icon: 'event',
        };
      case 'overdue':
        return {
          color: '#EF5350',
          text: '已过期',
          icon: 'warning',
        };
      default:
        return {
          color: '#999',
          text: '未知',
          icon: 'help',
        };
    }
  };

  const renderVaccineItem = ({ item }: { item: IVaccineRecord }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <Card style={styles.recordItem}>
        <View style={styles.recordHeader}>
          <View style={styles.headerLeft}>
            <Icon name={statusConfig.icon} size={20} color={statusConfig.color} />
            <Text style={styles.vaccineName}>{item.name}</Text>
          </View>
          <Badge color={statusConfig.color} text={statusConfig.text} />
        </View>

        <View style={styles.recordContent}>
          <View style={styles.infoRow}>
            <Icon name="event" size={16} color="#666" />
            <Text style={styles.infoText}>接种日期: {item.date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="local-hospital" size={16} color="#666" />
            <Text style={styles.infoText}>接种机构: {item.provider}</Text>
          </View>

          {item.nextDose && (
            <View style={styles.nextDoseSection}>
              <Text style={styles.sectionTitle}>下次接种</Text>
              <View style={styles.nextDoseInfo}>
                <View style={styles.infoRow}>
                  <Icon name="event" size={16} color="#666" />
                  <Text style={styles.infoText}>日期: {item.nextDose.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="vaccines" size={16} color="#666" />
                  <Text style={styles.infoText}>类型: {item.nextDose.type}</Text>
                </View>
              </View>
            </View>
          )}

          {item.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>备注</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <Button title="查看记录" icon="description" type="outline" size="small" />
          {item.status !== 'completed' && (
            <Button title="预约接种" icon="event" type="solid" size="small" onPress={onSchedule} />
          )}
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>疫苗接种记录</Text>
          <Text style={styles.subtitle}>全面的免疫接种管理</Text>
        </View>
        <Icon name="vaccines" size={24} color="#2E7D32" />
      </View>

      <FlatList
        data={[]} // 从API获取数据
        renderItem={renderVaccineItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  listContainer: {
    padding: 15,
  },
  recordItem: {
    marginBottom: 15,
    padding: 15,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '500',
  },
  recordContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  nextDoseSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  nextDoseInfo: {
    gap: 8,
  },
  notesSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 15,
  },
});
