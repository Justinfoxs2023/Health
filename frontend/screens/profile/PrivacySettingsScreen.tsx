import React from 'react';

import { LoadingSpinner } from '../../components';
import { View, ScrollView, StyleSheet, Text, Switch } from 'react-native';
import { getPrivacySettings, updatePrivacySettings } from '../../api/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface IPrivacySetting {
  /** key 的描述 */
  key: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** value 的描述 */
  value: boolean;
}

export const PrivacySettingsScreen = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('privacySettings', getPrivacySettings);

  const mutation = useMutation(updatePrivacySettings, {
    onSuccess: () => {
      queryClient.invalidateQueries('privacySettings');
    },
  });

  const handleToggle = (key: string, value: boolean) => {
    mutation.mutate({ [key]: value });
  };

  const settings: IPrivacySetting[] = [
    {
      key: 'profileVisibility',
      title: '个人资料可见性',
      description: '允许其他用户查看您的个人资料',
      value: data?.data?.profileVisibility ?? false,
    },
    {
      key: 'healthDataSharing',
      title: '健康数据共享',
      description: '允许营养师查看您的健康数据',
      value: data?.data?.healthDataSharing ?? false,
    },
    {
      key: 'dietPlanSharing',
      title: '饮食计划共享',
      description: '允许分享您的饮食计划给其他用户',
      value: data?.data?.dietPlanSharing ?? false,
    },
    {
      key: 'activityTracking',
      title: '活动追踪',
      description: '允许收集您的使用数据以改进服务',
      value: data?.data?.activityTracking ?? false,
    },
    {
      key: 'locationServices',
      title: '位置服务',
      description: '允许使用您的位置信息推荐附近的营养师',
      value: data?.data?.locationServices ?? false,
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>隐私设置</Text>
        <Text style={styles.sectionDesc}>管理您的隐私选项，我们会严格保护您的个人信息安全</Text>
      </View>

      {settings.map(setting => (
        <View key={setting.key} style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingDesc}>{setting.description}</Text>
          </View>
          <Switch
            value={setting.value}
            onValueChange={value => handleToggle(setting.key, value)}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={setting.value ? '#2E7D32' : '#fff'}
          />
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>数据安全</Text>
        <Text style={styles.footerText}>
          • 所有数据都经过加密存储和传输{'\n'}• 我们不会将您的个人信息分享给第三方{'\n'}•
          您可以随时导出或删除您的数据{'\n'}• 如需更多信息，请查看我们的隐私政策
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
