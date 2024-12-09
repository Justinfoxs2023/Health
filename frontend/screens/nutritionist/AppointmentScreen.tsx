import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-query';
import { getNutritionistDetails, createAppointment } from '../../api/nutritionist';
import { 
  LoadingSpinner, 
  NutritionistInfo, 
  DatePicker, 
  TimePicker,
  ConsultTypeSelector,
  TopicInput,
  PriceDisplay 
} from '../../components';

export const AppointmentScreen = ({ route, navigation }) => {
  const { nutritionistId } = route.params;
  const [date, setDate] = React.useState(null);
  const [time, setTime] = React.useState(null);
  const [type, setType] = React.useState('线上咨询');
  const [topic, setTopic] = React.useState('');

  const { data: nutritionist, isLoading } = useQuery(
    ['nutritionistDetails', nutritionistId],
    () => getNutritionistDetails(nutritionistId)
  );

  const mutation = useMutation(createAppointment, {
    onSuccess: () => {
      navigation.navigate('AppointmentSuccess');
    }
  });

  const handleSubmit = () => {
    if (!date || !time || !topic) {
      // 显示错误提示
      return;
    }

    const appointmentTime = new Date(date);
    appointmentTime.setHours(time.hour);
    appointmentTime.setMinutes(time.minute);

    mutation.mutate({
      nutritionistId,
      date: appointmentTime,
      type,
      topic,
      duration: 60, // 默认1小时
      price: type === '线上咨询' ? nutritionist.data.onlinePrice : nutritionist.data.offlinePrice
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <NutritionistInfo nutritionist={nutritionist.data} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择咨询方式</Text>
          <ConsultTypeSelector
            value={type}
            onChange={setType}
            onlinePrice={nutritionist.data.onlinePrice}
            offlinePrice={nutritionist.data.offlinePrice}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择咨询时间</Text>
          <DatePicker
            value={date}
            onChange={setDate}
            availability={nutritionist.data.availability}
          />
          {date && (
            <TimePicker
              value={time}
              onChange={setTime}
              availability={nutritionist.data.availability}
              date={date}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>咨询主题</Text>
          <TopicInput
            value={topic}
            onChangeText={setTopic}
            placeholder="请简要描述您想咨询的问题..."
          />
        </View>

        <PriceDisplay
          price={type === '线上咨询' ? nutritionist.data.onlinePrice : nutritionist.data.offlinePrice}
          duration={60}
        />
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!date || !time || !topic) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!date || !time || !topic}
      >
        <Text style={styles.submitButtonText}>确认预约</Text>
      </TouchableOpacity>

      {mutation.isLoading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollView: {
    flex: 1,
    padding: 15
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center'
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