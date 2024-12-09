import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getConsultationDetail } from '../../api/consultation';
import { LoadingSpinner, Icon, AlertDialog } from '../../components';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ConsultationDetail {
  id: string;
  expert: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    hospital: string;
  };
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  diagnosis?: string;
  prescription?: {
    medicines: {
      name: string;
      usage: string;
      duration: string;
      notes?: string;
    }[];
    notes?: string;
  };
  followUpDate?: string;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  price: number;
}

export const ConsultationDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { data: consultation, isLoading } = useQuery<ConsultationDetail>(
    ['consultationDetail', id],
    () => getConsultationDetail(id)
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '待就诊';
      case 'ongoing':
        return '进行中';
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
      case 'ongoing':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.expertInfo}>
          <Image source={{ uri: consultation?.expert.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.expertName}>{consultation?.expert.name}</Text>
            <Text style={styles.expertTitle}>{consultation?.expert.title}</Text>
            <Text style={styles.hospital}>{consultation?.expert.hospital}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(consultation?.status || '')}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(consultation?.status || '') }]}>
            {getStatusText(consultation?.status || '')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.timeInfo}>
          <Icon name="calendar" size={16} color="#666" />
          <Text style={styles.timeText}>
            {format(new Date(consultation?.date || ''), 'yyyy年MM月dd日', { locale: zhCN })}
          </Text>
          <Icon name="clock" size={16} color="#666" style={styles.timeIcon} />
          <Text style={styles.timeText}>{consultation?.timeSlot}</Text>
        </View>
        <Text style={styles.price}>¥{consultation?.price}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>咨询内容</Text>
        <Text style={styles.description}>{consultation?.description}</Text>
      </View>

      {consultation?.diagnosis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>诊断建议</Text>
          <Text style={styles.diagnosis}>{consultation.diagnosis}</Text>
        </View>
      )}

      {consultation?.prescription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>处方信息</Text>
          {consultation.prescription.medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineItem}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.medicineUsage}>用法：{medicine.usage}</Text>
              <Text style={styles.medicineDuration}>疗程：{medicine.duration}</Text>
              {medicine.notes && (
                <Text style={styles.medicineNotes}>备注：{medicine.notes}</Text>
              )}
            </View>
          ))}
          {consultation.prescription.notes && (
            <Text style={styles.prescriptionNotes}>
              医嘱：{consultation.prescription.notes}
            </Text>
          )}
        </View>
      )}

      {consultation?.followUpDate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>复诊时间</Text>
          <Text style={styles.followUpDate}>
            {format(new Date(consultation.followUpDate), 'yyyy年MM月dd日', { locale: zhCN })}
          </Text>
        </View>
      )}

      {consultation?.attachments && consultation.attachments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>附件资料</Text>
          <View style={styles.attachments}>
            {consultation.attachments.map((attachment, index) => (
              <TouchableOpacity
                key={index}
                style={styles.attachmentItem}
                onPress={() => {/* 打开附件 */}}
              >
                <Icon
                  name={attachment.type === 'image' ? 'image' : 'file-text'}
                  size={24}
                  color="#666"
                />
                <Text style={styles.attachmentName}>{attachment.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {consultation?.status === 'upcoming' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {/* 取消预约 */}}
          >
            <Text style={styles.secondaryButtonText}>取消预约</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ConsultationChat', { id })}
          >
            <Text style={styles.actionButtonText}>进入咨询</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#fff'
  },
  expertInfo: {
    flexDirection: 'row',
    flex: 1
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  expertTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  hospital: {
    fontSize: 12,
    color: '#999'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  section: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff'
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6
  },
  timeIcon: {
    marginLeft: 15
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57C00',
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  diagnosis: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  medicineItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8
  },
  medicineName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  medicineUsage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  medicineDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  medicineNotes: {
    fontSize: 14,
    color: '#666'
  },
  prescriptionNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8
  },
  followUpDate: {
    fontSize: 14,
    color: '#666'
  },
  attachments: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  attachmentItem: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center'
  },
  attachmentName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E7D32'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold'
  }
}); 