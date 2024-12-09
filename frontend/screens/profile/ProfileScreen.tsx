import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useQuery, useMutation } from 'react-query';
import { getUserProfile, updateUserProfile } from '../../api/user';
import {
  FormInput,
  ImagePicker,
  LoadingSpinner,
  AlertDialog
} from '../../components';

export const ProfileScreen = () => {
  const { data, isLoading } = useQuery('userProfile', getUserProfile);
  const [isEditing, setIsEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    avatar: '',
    name: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    dietaryRestrictions: [],
    healthConditions: []
  });
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    if (data?.data) {
      setForm(data.data);
    }
  }, [data]);

  const mutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      setIsEditing(false);
    }
  });

  const handleSubmit = () => {
    if (!form.name || !form.gender || !form.age) {
      setShowAlert(true);
      return;
    }

    mutation.mutate(form);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => isEditing && setShowImagePicker(true)}
        >
          <Image
            source={{ uri: form.avatar || 'default_avatar' }}
            style={styles.avatar}
          />
          {isEditing && (
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>编辑</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <FormInput
          label="姓名"
          value={form.name}
          onChangeText={(name) => setForm(prev => ({ ...prev, name }))}
          editable={isEditing}
          style={styles.field}
        />

        <FormInput
          label="性别"
          type="select"
          options={['男', '女', '其他']}
          value={form.gender}
          onChangeText={(gender) => setForm(prev => ({ ...prev, gender }))}
          editable={isEditing}
          style={styles.field}
        />

        <FormInput
          label="年龄"
          type="number"
          value={form.age}
          onChangeText={(age) => setForm(prev => ({ ...prev, age }))}
          editable={isEditing}
          style={styles.field}
        />

        <FormInput
          label="身高(cm)"
          type="number"
          value={form.height}
          onChangeText={(height) => setForm(prev => ({ ...prev, height }))}
          editable={isEditing}
          style={styles.field}
        />

        <FormInput
          label="体重(kg)"
          type="number"
          value={form.weight}
          onChangeText={(weight) => setForm(prev => ({ ...prev, weight }))}
          editable={isEditing}
          style={styles.field}
        />

        <FormInput
          label="运动水平"
          type="select"
          options={['久坐', '轻度活动', '中度活动', '重度活动']}
          value={form.activityLevel}
          onChangeText={(activityLevel) => setForm(prev => ({ ...prev, activityLevel }))}
          editable={isEditing}
          style={styles.field}
        />

        <FormInput
          label="饮食限制"
          type="multiSelect"
          options={[
            '无',
            '素食',
            '乳糖不耐',
            '麸质敏感',
            '海鲜过敏',
            '坚果过敏',
            '其他'
          ]}
          value={form.dietaryRestrictions}
          onChange={(dietaryRestrictions) => setForm(prev => ({ ...prev, dietaryRestrictions }))}
          editable={isEditing}
          style={styles.field}
        />

        <FormInput
          label="健康状况"
          type="multiSelect"
          options={[
            '无',
            '高血压',
            '糖尿病',
            '心脏病',
            '高血脂',
            '其他'
          ]}
          value={form.healthConditions}
          onChange={(healthConditions) => setForm(prev => ({ ...prev, healthConditions }))}
          editable={isEditing}
          style={styles.field}
        />
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          if (isEditing) {
            handleSubmit();
          } else {
            setIsEditing(true);
          }
        }}
      >
        <Text style={styles.actionButtonText}>
          {isEditing ? '保存' : '编辑资料'}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => {
            setForm(data.data);
            setIsEditing(false);
          }}
        >
          <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
            取消
          </Text>
        </TouchableOpacity>
      )}

      <AlertDialog
        visible={showAlert}
        title="提示"
        message="请填写必要的个人信息"
        onConfirm={() => setShowAlert(false)}
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
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  editBadgeText: {
    color: '#fff',
    fontSize: 12
  },
  form: {
    padding: 15
  },
  field: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
  },
  actionButton: {
    backgroundColor: '#2E7D32',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E7D32'
  },
  cancelButtonText: {
    color: '#2E7D32'
  }
}); 