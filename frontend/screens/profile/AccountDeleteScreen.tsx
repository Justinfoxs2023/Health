import React from 'react';

import { FormInput, AlertDialog, LoadingOverlay } from '../../components';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { deleteAccount } from '../../api/user';
import { useMutation } from '@tanstack/react-query';

export const AccountDeleteScreen = ({ navigation }) => {
  const [form, setForm] = React.useState({
    password: '',
    reason: '',
    confirmation: '',
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({
    title: '',
    message: '',
    confirmText: '确定',
    type: 'warning',
  });

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      // 清除本地存储的用户信息和token
      // 跳转到登录页面
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    },
    onError: (error: any) => {
      setAlertConfig({
        title: '注销失败',
        message: error.message || '账号注销失败，请稍后重试',
        confirmText: '确定',
        type: 'error',
      });
      setShowAlert(true);
    },
  });

  const handleSubmit = () => {
    if (!form.password) {
      setAlertConfig({
        title: '提示',
        message: '请输入密码',
        confirmText: '确定',
        type: 'warning',
      });
      setShowAlert(true);
      return;
    }

    if (form.confirmation !== '确认注销') {
      setAlertConfig({
        title: '提示',
        message: '请输入"确认注销"以确认操作',
        confirmText: '确定',
        type: 'warning',
      });
      setShowAlert(true);
      return;
    }

    setAlertConfig({
      title: '确认注销',
      message: '账号注销后将无法恢复，确定要继续吗？',
      confirmText: '确认注销',
      type: 'danger',
    });
    setShowAlert(true);
  };

  const handleConfirm = () => {
    if (alertConfig.type === 'danger') {
      mutation.mutate(form);
    }
    setShowAlert(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.warningSection}>
        <Text style={styles.warningTitle}>注销须知</Text>
        <Text style={styles.warningText}>
          • 账号注销后，所有数据将被永久删除{'\n'}• 包括个人资料、健康记录、咨询记录等{'\n'}•
          相关数据无法恢复{'\n'}• 绑定的第三方账号将自动解绑{'\n'}• 未使用的服务将无法退款
        </Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label="当前密码"
          placeholder="请输入当前密码"
          secureTextEntry
          value={form.password}
          onChangeText={password => setForm(prev => ({ ...prev, password }))}
          style={styles.field}
        />

        <FormInput
          label="注销原因"
          placeholder="请告诉我们注销账号的原因，帮助我们改进服务"
          multiline
          numberOfLines={4}
          value={form.reason}
          onChangeText={reason => setForm(prev => ({ ...prev, reason }))}
          style={styles.field}
        />

        <FormInput
          label="确认注销"
          placeholder='请输入"确认注销"'
          value={form.confirmation}
          onChangeText={confirmation => setForm(prev => ({ ...prev, confirmation }))}
          style={styles.field}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>申请注销</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>暂不注销</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>需要帮助？</Text>
        <Text style={styles.helpText}>
          如果您在使用过程中遇到任何问题，可以：{'\n'}• 查看帮助中心的常见问题{'\n'}•
          联系客服获取帮助{'\n'}• 向我们反馈意见和建议
        </Text>
      </View>

      <AlertDialog
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        type={alertConfig.type}
        onConfirm={handleConfirm}
        onCancel={() => setShowAlert(false)}
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
  warningSection: {
    margin: 15,
    padding: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    padding: 15,
  },
  field: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  submitButton: {
    backgroundColor: '#D32F2F',
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
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  helpSection: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
