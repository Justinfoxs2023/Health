import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useMutation } from 'react-query';
import { submitFeedback } from '../../api/feedback';
import {
  MenuSection,
  MenuItem,
  FormInput,
  ImageUploader,
  LoadingOverlay
} from '../../components';

export const HelpScreen = ({ navigation }) => {
  const [feedbackType, setFeedbackType] = React.useState('');
  const [content, setContent] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [contact, setContact] = React.useState('');

  const mutation = useMutation(submitFeedback, {
    onSuccess: () => {
      navigation.goBack();
    }
  });

  const handleSubmit = () => {
    if (!feedbackType || !content) {
      // 显示错误提示
      return;
    }

    mutation.mutate({
      type: feedbackType,
      content,
      images,
      contact
    });
  };

  return (
    <ScrollView style={styles.container}>
      <MenuSection title="常见问题">
        <MenuItem
          title="如何预约营养师?"
          onPress={() => navigation.navigate('HelpDetail', { id: 'booking' })}
        />
        <MenuItem
          title="如何查看健康数据?"
          onPress={() => navigation.navigate('HelpDetail', { id: 'health-data' })}
        />
        <MenuItem
          title="如何制定饮食计划?"
          onPress={() => navigation.navigate('HelpDetail', { id: 'diet-plan' })}
        />
        <MenuItem
          title="如何修改个人资料?"
          onPress={() => navigation.navigate('HelpDetail', { id: 'profile' })}
        />
      </MenuSection>

      <MenuSection title="问题反馈">
        <View style={styles.feedbackSection}>
          <FormInput
            label="反馈类型"
            placeholder="请选择反馈类型"
            value={feedbackType}
            onChangeText={setFeedbackType}
            type="select"
            options={[
              '功能建议',
              '问题反馈',
              '内容纠错',
              '其他'
            ]}
          />

          <FormInput
            label="反馈内容"
            placeholder="请详细描述您的问题或建议..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={5}
            style={styles.contentInput}
          />

          <ImageUploader
            images={images}
            onImagesChange={setImages}
            maxImages={3}
            title="添加截图(选填,最多3张)"
          />

          <FormInput
            label="联系方式"
            placeholder="请留下您的联系方式(选填)"
            value={contact}
            onChangeText={setContact}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!feedbackType || !content) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!feedbackType || !content}
          >
            <Text style={styles.submitButtonText}>提交反馈</Text>
          </TouchableOpacity>
        </View>
      </MenuSection>

      <MenuSection title="联系我们">
        <MenuItem
          title="客服电话"
          value="400-123-4567"
          showArrow={false}
        />
        <MenuItem
          title="服务时间"
          value="周一至周日 9:00-18:00"
          showArrow={false}
        />
        <MenuItem
          title="官方邮箱"
          value="support@health.com"
          showArrow={false}
        />
      </MenuSection>

      {mutation.isLoading && <LoadingOverlay />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  feedbackSection: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top'
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