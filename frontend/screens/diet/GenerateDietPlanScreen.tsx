import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useMutation } from 'react-query';
import { generateDietPlan } from '../../api/diet';
import {
  FormInput,
  WeightGoalSelector,
  DietaryRestrictionSelector,
  LoadingOverlay
} from '../../components';

export const GenerateDietPlanScreen = ({ navigation }) => {
  const [form, setForm] = React.useState({
    goal: '',
    duration: '7',
    restrictions: []
  });

  const mutation = useMutation(generateDietPlan, {
    onSuccess: () => {
      navigation.replace('DietPlan');
    }
  });

  const handleSubmit = () => {
    if (!form.goal) {
      // 显示错误提示
      return;
    }

    mutation.mutate(form);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <WeightGoalSelector
          value={form.goal}
          onChange={(goal) => setForm(prev => ({ ...prev, goal }))}
          style={styles.field}
        />

        <FormInput
          label="计划时长"
          type="select"
          options={[
            { label: '一周', value: '7' },
            { label: '两周', value: '14' },
            { label: '一个月', value: '30' }
          ]}
          value={form.duration}
          onChangeText={(duration) => setForm(prev => ({ ...prev, duration }))}
          style={styles.field}
        />

        <DietaryRestrictionSelector
          value={form.restrictions}
          onChange={(restrictions) => setForm(prev => ({ ...prev, restrictions }))}
          style={styles.field}
        />

        <TouchableOpacity
          style={[styles.submitButton, !form.goal && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!form.goal}
        >
          <Text style={styles.submitButtonText}>生成饮食计划</Text>
        </TouchableOpacity>
      </View>

      {mutation.isLoading && <LoadingOverlay />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  form: {
    padding: 15
  },
  field: {
    marginBottom: 15
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
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