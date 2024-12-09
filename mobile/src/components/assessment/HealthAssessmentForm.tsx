import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, RadioButton, useTheme } from 'react-native-paper';

interface HealthAssessmentFormProps {
  onSubmit: (data: HealthAssessmentData) => void;
}

export interface HealthAssessmentData {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  lifestyle: 'sedentary' | 'moderate' | 'active';
  sleepHours: number;
  healthGoals: string[];
  medicalHistory: string;
}

export const HealthAssessmentForm = ({ onSubmit }: HealthAssessmentFormProps) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<HealthAssessmentData>({
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
    lifestyle: 'moderate',
    sleepHours: 7,
    healthGoals: [],
    medicalHistory: ''
  });

  const handleSubmit = () => {
    // 表单验证
    if (!formData.age || !formData.height || !formData.weight) {
      alert('请填写完整信息');
      return;
    }
    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>健康评估问卷</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>年龄</Text>
        <TextInput
          value={formData.age.toString()}
          onChangeText={(value) => setFormData({...formData, age: parseInt(value) || 0})}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>性别</Text>
        <RadioButton.Group
          onValueChange={value => setFormData({...formData, gender: value as 'male' | 'female'})}
          value={formData.gender}
        >
          <View style={styles.radioGroup}>
            <RadioButton.Item label="男" value="male" />
            <RadioButton.Item label="女" value="female" />
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>身高 (cm)</Text>
        <TextInput
          value={formData.height.toString()}
          onChangeText={(value) => setFormData({...formData, height: parseInt(value) || 0})}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>体重 (kg)</Text>
        <TextInput
          value={formData.weight.toString()}
          onChangeText={(value) => setFormData({...formData, weight: parseInt(value) || 0})}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        提交评估
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  submitButton: {
    marginTop: 24,
  },
}); 