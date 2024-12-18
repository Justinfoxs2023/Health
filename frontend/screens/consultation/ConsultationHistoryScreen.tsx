import React from 'react';

import { LoadingSpinner, Icon, EmptyState } from '../../components';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { format } from 'date-fns';
import { getConsultationHistory } from '../../api/consultation';
import { useQuery } from '@tanstack/react-query';
import { zhCN } from 'date-fns/locale';

interface IConsultationRecord {
  /** id 的描述 */
  id: string;
  /** expert 的描述 */
  expert: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    hospital: string;
  };
  /** date 的描述 */
  date: string;
  /** timeSlot 的描述 */
  timeSlot: string;
  /** status 的描述 */
  status: 'upcoming' | 'completed' | 'cancelled';
  /** description 的描述 */
  description: string;
  /** diagnosis 的描述 */
  diagnosis?: string;
  /** prescription 的描述 */
  prescription?: string;
  /** followUpDate 的描述 */
  followUpDate?: string;
  /** price 的描述 */
  price: number;
}

export const ConsultationHistoryScreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = React.useState<'upcoming' | 'completed' | 'all'>(
    'all',
  );
  const { data: history, isLoading } = useQuery<IConsultationRecord[]>(
    'consultationHistory',
    getConsultationHistory,
  );

  const filteredHistory = history?.filter(record => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'upcoming') return record.status === 'upcoming';
    return record.status === 'completed';
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '待就诊';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const renderConsultation = ({ item: record }: { item: IConsultationRecord }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() => navigation.navigate('ConsultationDetail', { id: record.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.expertInfo}>
          <Image source={{ uri: record.expert.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.expertName}>{record.expert.name}</Text>
            <Text style={styles.expertTitle}>{record.expert.title}</Text>
            <Text style={styles.hospital}>{record.expert.hospital}</Text>
          </View>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: `${getStatusColor(record.status)}20` }]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>
            {getStatusText(record.status)}
          </Text>
        </View>
      </View>

      <View style={styles.timeInfo}>
        <Icon name="calendar" size={16} color="#666" />
        <Text style={styles.timeText}>
          {format(new Date(record.date), 'yyyy年MM月dd日', { locale: zhCN })}
        </Text>
        <Icon name="clock" size={16} color="#666" style={styles.timeIcon} />
        <Text style={styles.timeText}>{record.timeSlot}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionLabel}>咨询内容：</Text>
        <Text style={styles.description} numberOfLines={2}>
          {record.description}
        </Text>
      </View>

      {record.status === 'completed' && record.diagnosis && (
        <View style={styles.diagnosisSection}>
          <Text style={styles.diagnosisLabel}>诊断建议：</Text>
          <Text style={styles.diagnosis} numberOfLines={2}>
            {record.diagnosis}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.price}>¥{record.price}</Text>
        {record.status === 'upcoming' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ConsultationChat', { id: record.id })}
          >
            <Text style={styles.actionButtonText}>进入咨询</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'all' && styles.activeTab]}
          onPress={() => setSelectedStatus('all')}
        >
          <Text style={[styles.tabText, selectedStatus === 'all' && styles.activeTabText]}>
            全部
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedStatus('upcoming')}
        >
          <Text style={[styles.tabText, selectedStatus === 'upcoming' && styles.activeTabText]}>
            待就诊
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedStatus === 'completed' && styles.activeTab]}
          onPress={() => setSelectedStatus('completed')}
        >
          <Text style={[styles.tabText, selectedStatus === 'completed' && styles.activeTabText]}>
            已完成
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHistory}
        renderItem={renderConsultation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="calendar"
            title="暂无咨询记录"
            description="您还没有任何咨询记录，去找专家咨询吧"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  expertInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  expertTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  hospital: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  timeIcon: {
    marginLeft: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  descriptionSection: {
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  diagnosisSection: {
    marginBottom: 12,
  },
  diagnosisLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  diagnosis: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  actionButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    height: 10,
  },
});
