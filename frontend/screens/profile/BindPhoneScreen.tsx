import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useMutation } from 'react-query';
import { bindPhone, sendVerifyCode } from '../../api/user';
import { FormInput, LoadingOverlay, AlertDialog } from '../../components';

export const BindPhoneScreen = ({ navigation }) => {
  const [form, setForm] = React.useState({
    phone: '',
    code: ''
  });
  const [countdown, setCountdown] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const bindMutation = useMutation(bindPhone, {
    onSuccess: () => {
      setAlertMessage('手机绑定成功');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '手机绑定失败');
      setShowAlert(true);
    }
  });

  const codeMutation = useMutation(sendVerifyCode);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!form.phone) {
      setAlertMessage('请输入手机号');
      setShowAlert(true);
      return;
    }

    try {
      await codeMutation.mutateAsync(form.phone);
      startCountdown();
    } catch (error: any) {
      setAlertMessage(error.message || '验证码发送失败');
      setShowAlert(true);
    }
  };

  const handleSubmit = () => {
    if (!form.phone || !form.code) {
      setAlertMessage('请填写所有必填项');
      setShowAlert(true);
      return;
    }

    bindMutation.mutate(form);
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    if (bindMutation.isSuccess) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <FormInput
          label="手机号"
          placeholder="请输入手机号"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(phone) => setForm(prev => ({ ...prev, phone }))}
          style={styles.field}
        />

        <View style={styles.codeRow}>
          <FormInput
            label="验证码"
            placeholder="请输入验证码"
            keyboardType="number-pad"
            value={form.code}
            onChangeText={(code) => setForm(prev => ({ ...prev, code }))}
            style={[styles.field, styles.codeInput]}
          />
          <TouchableOpacity
            style={[styles.codeButton, countdown > 0 && styles.codeButtonDisabled]}
            onPress={handleSendCode}
            disabled={countdown > 0}
          >
            <Text style={styles.codeButtonText}>
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!form.phone || !form.code) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!form.phone || !form.code}
        >
          <Text style={styles.submitButtonText}>确认绑定</Text>
        </TouchableOpacity>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={handleAlertConfirm}
      />

      {(bindMutation.isLoading || codeMutation.isLoading) && <LoadingOverlay />}
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
  codeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  codeInput: {
    flex: 1,
    marginRight: 10
  },
  codeButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    height: 54
  },
  codeButtonDisabled: {
    backgroundColor: '#ccc'
  },
  codeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
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