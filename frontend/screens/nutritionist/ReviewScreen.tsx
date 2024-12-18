import React from 'react';

import {
  FormInput,
  RatingPicker,
  TagSelector,
  ImageUploader,
  LoadingOverlay,
} from '../../components';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createReview } from '../../api/nutritionist';
import { useMutation } from 'react-query';
export const ReviewScreen = ({ route, navigation }) => {
  const { nutritionistId, consultationId } = route.params;
  const [form, setForm] = React.useState({
    rating: 5,
    content: '',
    tags: [],
    images: [],
    isAnonymous: false,
  });

  const mutation = useMutation(createReview, {
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const tagOptions = ['专业负责', '耐心细致', '建议实用', '态度友好', '回复及时', '效果明显'];

  const handleSubmit = () => {
    if (!form.content) {
      // 显示错误提示
      return;
    }

    mutation.mutate({
      nutritionistId,
      consultationId,
      ...form,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.ratingSection}>
          <Text style={styles.label}>整体评分</Text>
          <RatingPicker
            value={form.rating}
            onChange={rating => setForm(prev => ({ ...prev, rating }))}
          />
        </View>

        <FormInput
          label="评价内容"
          placeholder="请分享您的咨询体验和建议..."
          multiline
          numberOfLines={4}
          value={form.content}
          onChangeText={content => setForm(prev => ({ ...prev, content }))}
          style={styles.field}
        />

        <View style={styles.tagSection}>
          <Text style={styles.label}>添加标签</Text>
          <TagSelector
            options={tagOptions}
            selected={form.tags}
            onChange={tags => setForm(prev => ({ ...prev, tags }))}
            style={styles.tagSelector}
          />
        </View>

        <ImageUploader
          images={form.images}
          onImagesChange={images => setForm(prev => ({ ...prev, images }))}
          maxImages={3}
          title="添加图片(选填,最多3张)"
          style={styles.field}
        />

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>匿名评价</Text>
          <TouchableOpacity
            style={[styles.switch, form.isAnonymous && styles.switchActive]}
            onPress={() => setForm(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
          >
            <View style={[styles.switchThumb, form.isAnonymous && styles.switchThumbActive]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !form.content && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!form.content}
        >
          <Text style={styles.submitButtonText}>提交评价</Text>
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
  ratingSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  field: {
    marginBottom: 15,
  },
  tagSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  tagSelector: {
    marginTop: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#81C784',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
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
