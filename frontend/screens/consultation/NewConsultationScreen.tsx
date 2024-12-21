import React from 'react';

import { FormInput, ImageUploader, NutritionistSelector, LoadingOverlay } from '../../components';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createConsultation } from '../../api/consultation';
import { useMutation } from 'react-query';

export const NewConsultationScreen = ({ navigation }) => {
  const [form, setForm] = React.useState({
    nutritionistId: '',
    type: '',
    content: {
      currentStatus: {
        diet: '',
        exercise: '',
        health: '',
      },
    },
    images: [],
  });

  const mutation = useMutation(createConsultation, {
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const handleSubmit = () => {
    if (!form.nutritionistId || !form.type || !form.content.currentStatus.diet) {
      // 显示错误提示
      return;
    }

    mutation.mutate(form);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <NutritionistSelector
          value={form.nutritionistId}
          onChange={nutritionistId => setForm(prev => ({ ...prev, nutritionistId }))}
          style={styles.field}
        />

        <FormInput
          label="咨询类型"
          type="select"
          options={['饮食建议', '运动指导', '健康评估', '其他']}
          value={form.type}
          onChangeText={type => setForm(prev => ({ ...prev, type }))}
          style={styles.field}
        />

        <FormInput
          label="当前饮食情况"
          placeholder="请描述您的日常饮食习惯..."
          multiline
          numberOfLines={4}
          value={form.content.currentStatus.diet}
          onChangeText={diet =>
            setForm(prev => ({
              ...prev,
              content: {
                ...prev.content,
                currentStatus: {
                  ...prev.content.currentStatus,
                  diet,
                },
              },
            }))
          }
          style={styles.field}
        />

        <FormInput
          label="运动情况"
          placeholder="请描述您的运动习惯..."
          multiline
          numberOfLines={4}
          value={form.content.currentStatus.exercise}
          onChangeText={exercise =>
            setForm(prev => ({
              ...prev,
              content: {
                ...prev.content,
                currentStatus: {
                  ...prev.content.currentStatus,
                  exercise,
                },
              },
            }))
          }
          style={styles.field}
        />

        <FormInput
          label="健康状况"
          placeholder="请描述您的健康状况..."
          multiline
          numberOfLines={4}
          value={form.content.currentStatus.health}
          onChangeText={health =>
            setForm(prev => ({
              ...prev,
              content: {
                ...prev.content,
                currentStatus: {
                  ...prev.content.currentStatus,
                  health,
                },
              },
            }))
          }
          style={styles.field}
        />

        <ImageUploader
          images={form.images}
          onImagesChange={images => setForm(prev => ({ ...prev, images }))}
          maxImages={3}
          title="添加相关图片(选填,最多3张)"
          style={styles.field}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!form.nutritionistId || !form.type || !form.content.currentStatus.diet) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!form.nutritionistId || !form.type || !form.content.currentStatus.diet}
        >
          <Text style={styles.submitButtonText}>提交咨询</Text>
        </TouchableOpacity>
      </View>

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
  field: {
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
