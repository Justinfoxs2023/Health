import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { updateProfile, uploadAvatar } from '../../api/user';
import {
  FormInput,
  ImagePicker,
  LoadingOverlay,
  AlertDialog,
  DatePicker
} from '../../components';

export const EditProfileScreen = ({ route, navigation }) => {
  const { profile } = route.params;
  const queryClient = useQueryClient();
  const [form, setForm] = React.useState({
    avatar: profile.avatar,
    nickname: profile.nickname,
    gender: profile.gender,
    birthday: profile.birthday,
    height: profile.height?.toString(),
    weight: profile.weight?.toString(),
    activityLevel: profile.activityLevel,
    dietaryRestrictions: profile.dietaryRestrictions || [],
    healthConditions: profile.healthConditions || [],
    introduction: profile.introduction
  });

  const [showImagePicker, setShowImagePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const updateMutation = useMutation(updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
      setAlertMessage('个人资料修改成功');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '个人资料修改失败');
      setShowAlert(true);
    }
  });

  const avatarMutation = useMutation(uploadAvatar, {
    onSuccess: (data) => {
      setForm(prev => ({ ...prev, avatar: data.url }));
    }
  });

  const handleSubmit = () => {
    if (!form.nickname) {
      setAlertMessage('请填写昵称');
      setShowAlert(true);
      return;
    }

    updateMutation.mutate(form);
  };

  const handleImageSelect = async (image: any) => {
    try {
      await avatarMutation.mutateAsync(image);
      setShowImagePicker(false);
    } catch (error: any) {
      setAlertMessage(error.message || '头像上传失败');
      setShowAlert(true);
    }
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    if (updateMutation.isSuccess) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => setShowImagePicker(true)}
        >
          <Image
            source={{ uri: form.avatar || 'default_avatar' }}
            style={styles.avatar}
          />
          <View style={styles.avatarOverlay}>
            <Text style={styles.avatarText}>更换头像</Text>
          </View>
        </TouchableOpacity>

        <FormInput
          label="昵称"
          placeholder="请输入昵称"
          value={form.nickname}
          onChangeText={(nickname) => setForm(prev => ({ ...prev, nickname }))}
          style={styles.field}
        />

        <FormInput
          label="性别"
          type="select"
          options={[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
            { label: '其他', value: 'other' }
          ]}
          value={form.gender}
          onChange={(gender) => setForm(prev => ({ ...prev, gender }))}
          style={styles.field}
        />

        <TouchableOpacity
          style={styles.field}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.label}>生日</Text>
          <Text style={styles.value}>
            {form.birthday ? new Date(form.birthday).toLocaleDateString() : '请选择生日'}
          </Text>
        </TouchableOpacity>

        <FormInput
          label="身高(cm)"
          keyboardType="numeric"
          value={form.height}
          onChangeText={(height) => setForm(prev => ({ ...prev, height }))}
          style={styles.field}
        />

        <FormInput
          label="体重(kg)"
          keyboardType="numeric"
          value={form.weight}
          onChangeText={(weight) => setForm(prev => ({ ...prev, weight }))}
          style={styles.field}
        />

        <FormInput
          label="运动水平"
          type="select"
          options={[
            { label: '久坐', value: 'sedentary' },
            { label: '轻度活动', value: 'light' },
            { label: '中度活动', value: 'moderate' },
            { label: '重度活动', value: 'heavy' }
          ]}
          value={form.activityLevel}
          onChange={(activityLevel) => setForm(prev => ({ ...prev, activityLevel }))}
          style={styles.field}
        />

        <FormInput
          label="饮食限制"
          type="multiSelect"
          options={[
            { label: '无', value: 'none' },
            { label: '素食', value: 'vegetarian' },
            { label: '乳糖不耐', value: 'lactose' },
            { label: '麸质敏感', value: 'gluten' },
            { label: '海鲜过敏', value: 'seafood' },
            { label: '坚果过敏', value: 'nuts' }
          ]}
          value={form.dietaryRestrictions}
          onChange={(dietaryRestrictions) => setForm(prev => ({ ...prev, dietaryRestrictions }))}
          style={styles.field}
        />

        <FormInput
          label="健康状况"
          type="multiSelect"
          options={[
            { label: '无', value: 'none' },
            { label: '高血压', value: 'hypertension' },
            { label: '糖尿病', value: 'diabetes' },
            { label: '心脏病', value: 'heart' },
            { label: '高血脂', value: 'cholesterol' }
          ]}
          value={form.healthConditions}
          onChange={(healthConditions) => setForm(prev => ({ ...prev, healthConditions }))}
          style={styles.field}
        />

        <FormInput
          label="个人简介"
          placeholder="介绍一下自己吧..."
          multiline
          numberOfLines={4}
          value={form.introduction}
          onChangeText={(introduction) => setForm(prev => ({ ...prev, introduction }))}
          style={styles.field}
        />

        <TouchableOpacity
          style={[styles.submitButton, !form.nickname && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!form.nickname}
        >
          <Text style={styles.submitButtonText}>保存修改</Text>
        </TouchableOpacity>
      </View>

      <ImagePicker
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
      />

      <DatePicker
        visible={showDatePicker}
        value={form.birthday ? new Date(form.birthday) : new Date()}
        onConfirm={(date) => {
          setForm(prev => ({ ...prev, birthday: date.toISOString() }));
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={handleAlertConfirm}
      />

      {(updateMutation.isLoading || avatarMutation.isLoading) && <LoadingOverlay />}
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    alignItems: 'center'
  },
  avatarText: {
    color: '#fff',
    fontSize: 14
  },
  field: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8
  },
  value: {
    fontSize: 16,
    color: '#666'
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