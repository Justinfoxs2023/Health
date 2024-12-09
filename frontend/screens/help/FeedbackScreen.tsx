import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useMutation } from 'react-query';
import { submitFeedback } from '../../api/help';
import {
  FormInput,
  ImageUploader,
  LoadingOverlay,
  AlertDialog
} from '../../components';

export const FeedbackScreen = ({ navigation }) => {
  const [form, setForm] = React.useState({
    type: '',
    content: '',
    images: [],
    contact: ''
  });
  const [showAlert, setShowAlert] = React.useState(false);

  const mutation = useMutation(submitFeedback, {
    onSuccess: () => {
      setShowAlert(true);
    }
  });

  const handleSubmit = () => {
    if (!form.type || !form.content) {
      // 显示错误提示
      return;
    }

    mutation.mutate(form);
  };

  const feedbackTypes = [
    '功能建议',
    '内容纠错',
    '操作问题',
    '界面优化',
    '其他问题'
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.typeSection}>
          <Text style={styles.label}>问题类型</Text>
          <View style={styles.typeGrid}>
            {feedbackTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.typeButton,
                  form.type === type && styles.typeButtonActive
                ]}
                onPress={() => setForm(prev => ({ ...prev, type }))}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    form.type === type && styles.typeButtonTextActive
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FormInput
          label="问题描述"
          placeholder="请详细描述您遇到的问题或建议..."
          multiline
          numberOfLines={6}
          value={form.content}
          onChangeText={(content) => setForm(prev => ({ ...prev, content }))}
          style={styles.field}
        />

        <ImageUploader
          images={form.images}
          onImagesChange={(images) => setForm(prev => ({ ...prev, images }))}
          maxImages={3}
          title="添加截图(选填,最多3张)"
          style={styles.field}
        />

        <FormInput
          label="联系方式(选填)"
          placeholder="请留下您的邮箱或手机号,方便我们回复您"
          value={form.contact}
          onChangeText={(contact) => setForm(prev => ({ ...prev, contact }))}
          style={styles.field}
        />

        <TouchableOpacity
          style={[styles.submitButton, (!form.type || !form.content) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!form.type || !form.content}
        >
          <Text style={styles.submitButtonText}>提交反馈</Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提交成功"
        message="感谢您的反馈,我们会认真处理您的建议"
        onConfirm={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />

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
  typeSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5
  },
  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 5
  },
  typeButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32'
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666'
  },
  typeButtonTextActive: {
    color: '#2E7D32'
  },
  field: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
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