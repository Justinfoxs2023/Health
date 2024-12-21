import React from 'react';

import { FormInput, MealPlanEditor, LoadingOverlay, AlertDialog } from '../../components';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { replyConsultation } from '../../api/consultation';
import { useMutation } from 'react-query';

export const ConsultationReplyScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [form, setForm] = React.useState({
    recommendations: [
      {
        category: '',
        content: '',
        priority: '中',
      },
    ],
    mealPlan: [],
    followUpDate: null,
  });
  const [showAlert, setShowAlert] = React.useState(false);

  const mutation = useMutation(replyConsultation, {
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const handleAddRecommendation = () => {
    setForm(prev => ({
      ...prev,
      recommendations: [
        ...prev.recommendations,
        {
          category: '',
          content: '',
          priority: '中',
        },
      ],
    }));
  };

  const handleSubmit = () => {
    // 表单验证
    if (!form.recommendations[0].category || !form.recommendations[0].content) {
      setShowAlert(true);
      return;
    }

    mutation.mutate({
      consultationId: id,
      ...form,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {form.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationForm}>
            <Text style={styles.groupTitle}>建议 {index + 1}</Text>
            <FormInput
              label="类别"
              type="select"
              options={['饮食建议', '运动建议', '生活方式', '其他']}
              value={rec.category}
              onChangeText={category => {
                const newRecs = [...form.recommendations];
                newRecs[index].category = category;
                setForm(prev => ({ ...prev, recommendations: newRecs }));
              }}
              style={styles.field}
            />

            <FormInput
              label="建议内容"
              placeholder="请输入具体建议内容..."
              multiline
              numberOfLines={4}
              value={rec.content}
              onChangeText={content => {
                const newRecs = [...form.recommendations];
                newRecs[index].content = content;
                setForm(prev => ({ ...prev, recommendations: newRecs }));
              }}
              style={styles.field}
            />

            <FormInput
              label="优先级"
              type="select"
              options={['高', '中', '低']}
              value={rec.priority}
              onChangeText={priority => {
                const newRecs = [...form.recommendations];
                newRecs[index].priority = priority;
                setForm(prev => ({ ...prev, recommendations: newRecs }));
              }}
              style={styles.field}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddRecommendation}>
          <Text style={styles.addButtonText}>添加建议</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.groupTitle}>膳食计划</Text>
        <MealPlanEditor
          value={form.mealPlan}
          onChange={mealPlan => setForm(prev => ({ ...prev, mealPlan }))}
          style={styles.field}
        />

        <FormInput
          label="随访日期"
          type="date"
          value={form.followUpDate}
          onChange={date => setForm(prev => ({ ...prev, followUpDate: date }))}
          style={styles.field}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>提交回复</Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message="请至少填写一条建议的类别和内容"
        onConfirm={() => setShowAlert(false)}
      />

      {mutation.isLoading && <LoadingOverlay />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 15,
  },
  recommendationForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  field: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
