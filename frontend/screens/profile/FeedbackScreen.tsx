import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { submitFeedback } from '../../api/user';
import { FormInput, ImageUploader, LoadingOverlay, AlertDialog } from '../../components';

interface FeedbackType {
  key: string;
  title: string;
  description: string;
}

export const FeedbackScreen = ({ navigation }) => {
  const [form, setForm] = React.useState({
    type: '',
    content: '',
    images: [],
    contact: ''
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const feedbackTypes: FeedbackType[] = [
    {
      key: 'bug',
      title: '功能异常',
      description: '程序错误、功能无法使用等'
    },
    {
      key: 'suggestion',
      title: '功能建议',
      description: '新功能建议、使用体验改进等'
    },
    {
      key: 'content',
      title: '内容问题',
      description: '内容错误、展示异常等'
    },
    {
      key: 'service',
      title: '服务投诉',
      description: '服务质量、态度问题等'
    },
    {
      key: 'other',
      title: '其他问题',
      description: '其他类型的问题或建议'
    }
  ];

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      setAlertMessage('感谢您的反馈，我们会认真处理您的建议');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '提交失败，请稍后重试');
      setShowAlert(true);
    }
  });

  const handleSubmit = () => {
    if (!form.type || !form.content) {
      setAlertMessage('请选择反馈类型并填写反馈内容');
      setShowAlert(true);
      return;
    }

    mutation.mutate(form);
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    if (mutation.isSuccess) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>意见反馈</Text>
        <Text style={styles.description}>
          您的反馈对我们很重要，我们会认真处理每一条反馈信息
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>反馈类型</Text>
        <View style={styles.typeGrid}>
          {feedbackTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.typeButton,
                form.type === type.key && styles.typeButtonActive
              ]}
              onPress={() => setForm(prev => ({ ...prev, type: type.key }))}
            >
              <Text style={[
                styles.typeTitle,
                form.type === type.key && styles.typeTitleActive
              ]}>
                {type.title}
              </Text>
              <Text style={[
                styles.typeDesc,
                form.type === type.key && styles.typeDescActive
              ]}>
                {type.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FormInput
          label="反馈内容"
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
          title="添加图片(选填,最多3张)"
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
          style={[
            styles.submitButton,
            (!form.type || !form.content) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!form.type || !form.content}
        >
          <Text style={styles.submitButtonText}>提交反馈</Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={handleAlertConfirm}
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
  header: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  form: {
    padding: 15
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  typeGrid: {
    marginBottom: 15
  },
  typeButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  typeButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32'
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  typeTitleActive: {
    color: '#2E7D32'
  },
  typeDesc: {
    fontSize: 14,
    color: '#666'
  },
  typeDescActive: {
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