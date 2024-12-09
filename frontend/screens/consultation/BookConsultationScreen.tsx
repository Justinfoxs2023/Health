import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getExpertDetail, bookConsultation } from '../../api/consultation';
import { LoadingSpinner, Icon, AlertDialog, Calendar } from '../../components';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const BookConsultationScreen = ({ route, navigation }) => {
  const { expertId } = route.params;
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string>('');
  const [description, setDescription] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const { data: expert, isLoading } = useQuery(
    ['expertDetail', expertId],
    () => getExpertDetail(expertId)
  );

  const bookMutation = useMutation(bookConsultation, {
    onSuccess: () => {
      navigation.replace('ConsultationSuccess', { expertId });
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '预约失败，请重试');
      setShowAlert(true);
    }
  });

  const handleSubmit = () => {
    if (!selectedDate) {
      setAlertMessage('请选择咨询日期');
      setShowAlert(true);
      return;
    }
    if (!selectedTimeSlot) {
      setAlertMessage('请选择咨询时间');
      setShowAlert(true);
      return;
    }
    if (!description.trim()) {
      setAlertMessage('请描述您的咨询问题');
      setShowAlert(true);
      return;
    }

    bookMutation.mutate({
      expertId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      description: description.trim()
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.expertInfo}>
          <Text style={styles.sectionTitle}>预约专家</Text>
          <View style={styles.expertRow}>
            <Text style={styles.expertName}>{expert?.name}</Text>
            <Text style={styles.expertTitle}>{expert?.title}</Text>
            <Text style={styles.price}>¥{expert?.price}/次</Text>
          </View>
          <Text style={styles.hospital}>{expert?.hospital}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择日期</Text>
          <Calendar
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            markedDates={expert?.availableTime.reduce((acc, curr) => ({
              ...acc,
              [curr.date]: { marked: true }
            }), {})}
          />
        </View>

        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>选择时间</Text>
            <View style={styles.timeSlots}>
              {expert?.availableTime
                .find(t => t.date === selectedDate)
                ?.slots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlot === slot && styles.selectedTimeSlot
                    ]}
                    onPress={() => setSelectedTimeSlot(slot)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTimeSlot === slot && styles.selectedTimeSlotText
                    ]}>{slot}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>咨询问题描述</Text>
          <TextInput
            style={styles.input}
            placeholder="请详细描述您的问题，以便医生提前了解..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.noticeSection}>
          <Icon name="info" size={16} color="#F57C00" />
          <Text style={styles.noticeText}>
            预约成功后，请准时参加咨询。如需取消，请提前24小时操作。
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>总计</Text>
          <Text style={styles.totalPrice}>¥{expert?.price}</Text>
        </View>
        <TouchableOpacity
          style={[styles.submitButton, (!selectedDate || !selectedTimeSlot || !description.trim()) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!selectedDate || !selectedTimeSlot || !description.trim() || bookMutation.isLoading}
        >
          <Text style={styles.submitButtonText}>确认预约</Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />

      {bookMutation.isLoading && <LoadingSpinner />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  expertInfo: {
    padding: 15,
    backgroundColor: '#fff'
  },
  expertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8
  },
  expertTitle: {
    fontSize: 14,
    color: '#666',
    marginRight: 8
  },
  price: {
    fontSize: 16,
    color: '#F57C00',
    fontWeight: 'bold'
  },
  hospital: {
    fontSize: 14,
    color: '#666'
  },
  section: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 8,
    marginRight: '3%',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  selectedTimeSlot: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
    borderWidth: 1
  },
  timeSlotText: {
    fontSize: 14,
    color: '#666'
  },
  selectedTimeSlotText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    height: 100,
    textAlignVertical: 'top'
  },
  noticeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF3E0',
    marginTop: 10
  },
  noticeText: {
    fontSize: 12,
    color: '#F57C00',
    marginLeft: 8,
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0'
  },
  priceInfo: {
    flex: 1
  },
  totalLabel: {
    fontSize: 12,
    color: '#999'
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F57C00'
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 24
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 