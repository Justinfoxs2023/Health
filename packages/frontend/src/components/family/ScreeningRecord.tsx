import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Icon, Button } from '../common';

interface ScreeningRecord {
  id: string;
  type: string;
  date: string;
  result: 'normal' | 'abnormal' | 'pending';
  details?: string;
  followUp?: {
    date: string;
    notes: string;
  };
}

interface Props {
  memberId: string;
}

export const ScreeningRecord: React.FC<Props> = ({ memberId }) => {
  const getResultColor = (result: string) => {
    switch (result) {
      case 'normal':
        return '#66BB6A';
      case 'abnormal':
        return '#EF5350';
      case 'pending':
        return '#FFA726';
      default:
        return '#999';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'normal':
        return '正常';
      case 'abnormal':
        return '异常';
      case 'pending':
        return '待处理';
      default:
        return '未知';
    }
  };

  const renderScreeningItem = ({ item }: { item: ScreeningRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <View>
          <Text style={styles.screeningType}>{item.type}</Text>
          <Text style={styles.screeningDate}>{item.date}</Text>
        </View>
        <View style={[
          styles.resultBadge,
          { backgroundColor: getResultColor(item.result) }
        ]}>
          <Text style={styles.resultText}>
            {getResultText(item.result)}
          </Text>
        </View>
      </View>

      {item.details && (
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>检查详情</Text>
          <Text style={styles.detailsText}>{item.details}</Text>
        </View>
      )}

      {item.followUp && (
        <View style={styles.followUpSection}>
          <Text style={styles.followUpTitle}>随访安排</Text>
          <View style={styles.followUpContent}>
            <Text style={styles.followUpDate}>日期: {item.followUp.date}</Text>
            <Text style={styles.followUpNotes}>{item.followUp.notes}</Text>
          </View>
        </View>
      )}

      <View style={styles.actionButtons}>
        <Button
          title="查看报告"
          icon="description"
          type="outline"
          size="small"
        />
        <Button
          title="预约随访"
          icon="event"
          type="outline"
          size="small"
        />
      </View>
    </View>
  );

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>体检记录</Text>
          <Text style={styles.subtitle}>定期体检结果追踪</Text>
        </View>
        <Icon name="health-and-safety" size={24} color="#2E7D32" />
      </View>

      <FlatList
        data={[]} // 从API获取数据
        renderItem={renderScreeningItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  listContainer: {
    padding: 15
  },
  recordItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  screeningType: {
    fontSize: 15,
    fontWeight: '500'
  },
  screeningDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  resultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  detailsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5
  },
  detailsText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18
  },
  followUpSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6
  },
  followUpTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5
  },
  followUpContent: {
    gap: 4
  },
  followUpDate: {
    fontSize: 13,
    color: '#666'
  },
  followUpNotes: {
    fontSize: 13,
    color: '#444'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12
  }
}); 