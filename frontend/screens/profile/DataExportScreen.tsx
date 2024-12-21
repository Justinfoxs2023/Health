import React from 'react';

import { Icon } from '../../components/Icon';
import { LoadingSpinner, AlertDialog } from '../../components';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { exportUserData } from '../../api/user';
import { useMutation } from '@tanstack/react-query';

interface IExportOption {
  /** key 的描述 */
  key: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** icon 的描述 */
  icon: string;
}

export const DataExportScreen = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const mutation = useMutation({
    mutationFn: exportUserData,
    onSuccess: data => {
      // 处理导出成功，例如下载文件或分享
      setAlertMessage('数据导出成功，请在通知中心查看下载链接');
      setShowAlert(true);
    },
    onError: (error: any) => {
      setAlertMessage(error.message || '数据导出失败');
      setShowAlert(true);
    },
  });

  const exportOptions: IExportOption[] = [
    {
      key: 'all',
      title: '全部数据',
      description: '导出所有个人数据，包括健康记录、饮食计划等',
      icon: 'database',
    },
    {
      key: 'health',
      title: '健康数据',
      description: '仅导出健康相关数据，如体重、血压等记录',
      icon: 'activity',
    },
    {
      key: 'diet',
      title: '饮食记录',
      description: '导出饮食计划和饮食记录',
      icon: 'clipboard',
    },
    {
      key: 'consultation',
      title: '咨询记录',
      description: '导出与营养师的咨询记录',
      icon: 'message-square',
    },
  ];

  const handleExport = (type: string) => {
    mutation.mutate({ type });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>数据导出</Text>
        <Text style={styles.description}>
          您可以导出您的个人数据。导出的数据将以加密的ZIP文件形式提供，包含CSV或JSON格式的文件。
        </Text>
      </View>

      {exportOptions.map(option => (
        <TouchableOpacity
          key={option.key}
          style={styles.optionCard}
          onPress={() => handleExport(option.key)}
        >
          <View style={styles.optionIcon}>
            <Icon name={option.icon} size={24} color="#2E7D32" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDesc}>{option.description}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      ))}

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>数据安全提示</Text>
        <Text style={styles.noticeText}>
          • 导出的数据文件将被加密保护{'\n'}• 请妥善保管导出的数据文件{'\n'}• 文件有效期为24小时
          {'\n'}• 如需帮助请联系客服
        </Text>
      </View>

      <AlertDialog
        visible={showAlert}
        title="提示"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 1,
    padding: 15,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#666',
  },
  notice: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
