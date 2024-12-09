import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getExerciseGoals, updateExerciseGoals } from '../../api/exercise';
import { FormInput, LoadingSpinner, AlertDialog } from '../../components';

interface ExerciseGoals {
  weeklyFrequency: number;
  weeklyDuration: number;
  weeklyCalories: number;
  preferredTime: 'morning' | 'afternoon' | 'evening';
  focusAreas: string[];
  intensity: 'low' | 'medium' | 'high';
  reminders: boolean;
}

export const ExerciseGoalSettingScreen = ({ navigation }) => {
  const { data: currentGoals, isLoading } = useQuery<ExerciseGoals>('exerciseGoals', getExerciseGoals);
  const [form, setForm] = React.useState<ExerciseGoals>({
    weeklyFrequency: 3,
    weeklyDuration: 150,
    weeklyCalories: 1500,
    preferredTime: 'morning',
    focusAreas: [],
    intensity: 'medium',
    reminders: true
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  React.useEffect(() => {
    if (currentGoals) {
      setForm(currentGoals);
    }
  }, [currentGoals]);

  const mutation = useMutation(updateExerciseGoals, {
    onSuccess: () => {
      setAlertMessage('运动目标设置成功');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '设置失败，请重试');
      setShowAlert(true);
    }
  });

  const focusAreaOptions = [
    { label: '有氧耐力', value: 'cardio' },
    { label: '力量训练', value: 'strength' },
    { label: '核心训练', value: 'core' },
    { label: '柔韧性', value: 'flexibility' },
    { label: '平衡协调', value: 'balance' }
  ];

  const timeOptions = [
    { label: '早晨', value: 'morning' },
    { label: '下午', value: 'afternoon' },
    { label: '晚上', value: 'evening' }
  ];

  const intensityOptions = [
    { label: '低强度', value: 'low', desc: '适合初学者，心率保持在最大心率的50-60%' },
    { label: '中等强度', value: 'medium', desc: '适合有基础的人，心率保持在最大心率的60-70%' },
    { label: '高强度', value: 'high', desc: '适合训练有素的人，心率保持在最大心率的70-85%' }
  ];

  const handleSubmit = () => {
    if (form.weeklyFrequency < 1 || form.weeklyFrequency > 7) {
      setAlertMessage('每周运动次数应在1-7次之间');
      setShowAlert(true);
      return;
    }

    if (form.weeklyDuration < 60 || form.weeklyDuration > 1200) {
      setAlertMessage('每周运动时长应在60-1200分钟之间');
      setShowAlert(true);
      return;
    }

    if (form.focusAreas.length === 0) {
      setAlertMessage('请至少选择一个重点训练部位');
      setShowAlert(true);
      return;
    }

    mutation.mutate(form);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>运动目标设置</Text>
        <Text style={styles.headerDesc}>
          设定合理的运动目标，我们将为您制定个性化的运动计划
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基础目标</Text>
        <FormInput
          label="每周运动次数"
          type="number"
          value={form.weeklyFrequency.toString()}
          onChangeText={(value) => setForm(prev => ({ ...prev, weeklyFrequency: parseInt(value) || 0 }))}
          keyboardType="number-pad"
          helperText="建议每周运动3-5次"
          style={styles.input}
        />

        <FormInput
          label="每周运动时长(分钟)"
          type="number"
          value={form.weeklyDuration.toString()}
          onChangeText={(value) => setForm(prev => ({ ...prev, weeklyDuration: parseInt(value) || 0 }))}
          keyboardType="number-pad"
          helperText="建议每周运动150分钟以上"
          style={styles.input}
        />

        <FormInput
          label="每周消耗热量(千卡)"
          type="number"
          value={form.weeklyCalories.toString()}
          onChangeText={(value) => setForm(prev => ({ ...prev, weeklyCalories: parseInt(value) || 0 }))}
          keyboardType="number-pad"
          helperText="根据个人情况设定合理目标"
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>训练偏好</Text>
        <Text style={styles.label}>重点训练部位</Text>
        <View style={styles.optionsGrid}>
          {focusAreaOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                form.focusAreas.includes(option.value) && styles.optionButtonActive
              ]}
              onPress={() => {
                const newAreas = form.focusAreas.includes(option.value)
                  ? form.focusAreas.filter(v => v !== option.value)
                  : [...form.focusAreas, option.value];
                setForm(prev => ({ ...prev, focusAreas: newAreas }));
              }}
            >
              <Text style={[
                styles.optionText,
                form.focusAreas.includes(option.value) && styles.optionTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>运动强度</Text>
        {intensityOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.intensityButton,
              form.intensity === option.value && styles.intensityButtonActive
            ]}
            onPress={() => setForm(prev => ({ ...prev, intensity: option.value }))}
          >
            <Text style={[
              styles.intensityTitle,
              form.intensity === option.value && styles.intensityTitleActive
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.intensityDesc,
              form.intensity === option.value && styles.intensityDescActive
            ]}>
              {option.desc}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>首选运动时间</Text>
        <View style={styles.timeButtons}>
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.timeButton,
                form.preferredTime === option.value && styles.timeButtonActive
              ]}
              onPress={() => setForm(prev => ({ ...prev, preferredTime: option.value }))}
            >
              <Text style={[
                styles.timeText,
                form.preferredTime === option.value && styles.timeTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>保存设置</Text>
      </TouchableOpacity>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />

      {mutation.isLoading && <LoadingSpinner />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  headerDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  section: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  input: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 15
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5
  },
  optionButton: {
    width: '48%',
    margin: '1%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center'
  },
  optionButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32'
  },
  optionText: {
    fontSize: 14,
    color: '#666'
  },
  optionTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  intensityButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10
  },
  intensityButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32'
  },
  intensityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  intensityTitleActive: {
    color: '#2E7D32'
  },
  intensityDesc: {
    fontSize: 14,
    color: '#666'
  },
  intensityDescActive: {
    color: '#2E7D32'
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginHorizontal: 5
  },
  timeButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32'
  },
  timeText: {
    fontSize: 14,
    color: '#666'
  },
  timeTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  submitButton: {
    margin: 20,
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 