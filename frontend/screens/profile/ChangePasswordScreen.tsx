import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useMutation } from 'react-query';
import { changePassword } from '../../api/user';
import { FormInput, LoadingOverlay, AlertDialog } from '../../components';

export const ChangePasswordScreen = ({ navigation }) => {
  const [form, setForm] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const mutation = useMutation(changePassword, {
    onSuccess: () => {
      setAlertMessage('密码修改成功');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '密码修改失败');
      setShowAlert(true);
    }
  });

  const handleSubmit = () => {
    // 表单验证
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setAlertMessage('请填写所有必填项');
      setShowAlert(true);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setAlertMessage('两次输入的新密码不一致');
      setShowAlert(true);
      return;
    }

    if (form.newPassword.length < 8) {
      setAlertMessage('新密码长度不能少于8位');
      setShowAlert(true);
      return;
    }

    // 密码复杂度验证
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(form.newPassword)) {
      setAlertMessage('新密码必须包含大小写字母和数字');
      setShowAlert(true);
      return;
    }

    mutation.mutate({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    });
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    if (mutation.isSuccess) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <FormInput
          label="当前密码"
          placeholder="请输入当前密码"
          secureTextEntry
          value={form.oldPassword}
          onChangeText={(oldPassword) => setForm(prev => ({ ...prev, oldPassword }))}
          style={styles.field}
        />

        <FormInput
          label="新密码"
          placeholder="请输入新密码(不少于8位)"
          secureTextEntry
          value={form.newPassword}
          onChangeText={(newPassword) => setForm(prev => ({ ...prev, newPassword }))}
          style={styles.field}
          helperText="密码必须包含大小写字母和数字"
        />

        <FormInput
          label="确认新密码"
          placeholder="请再次输入新密码"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(confirmPassword) => setForm(prev => ({ ...prev, confirmPassword }))}
          style={styles.field}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!form.oldPassword || !form.newPassword || !form.confirmPassword) && 
            styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!form.oldPassword || !form.newPassword || !form.confirmPassword}
        >
          <Text style={styles.submitButtonText}>确认修改</Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={handleAlertConfirm}
      />

      {mutation.isLoading && <LoadingOverlay />}
    </View>
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