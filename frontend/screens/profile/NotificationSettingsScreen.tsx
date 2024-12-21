import React from 'react';

import { INotificationSettings, IApiResponse } from '../../api/types';
import { LoadingSpinner } from '../../components';
import { View, ScrollView, StyleSheet, Text, Switch } from 'react-native';
import { getNotificationSettings, updateNotificationSettings } from '../../api/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface INotificationSetting {
  /** key 的描述 */
  key: keyof INotificationSettings;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** value 的描述 */
  value: boolean;
}

export const NotificationSettingsScreen = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<IApiResponse<INotificationSettings>>(
    ['notificationSettings'],
    getNotificationSettings,
  );

  const mutation = useMutation<
    IApiResponse<INotificationSettings>,
    Error,
    Partial<INotificationSettings>
  >({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    },
  });

  const handleToggle = (key: keyof INotificationSettings, value: boolean) => {
    mutation.mutate({ [key]: value });
  };

  const settings: INotificationSetting[] = [
    {
      key: 'appointmentReminder',
      title: '预约提醒',
      description: '预约前24小时发送提醒通知',
      value: data?.data?.appointmentReminder ?? false,
    },
    {
      key: 'consultationMessage',
      title: '咨询消息',
      description: '收到营养师回复时通知',
      value: data?.data?.consultationMessage ?? false,
    },
    {
      key: 'healthAlert',
      title: '健康预警',
      description: '检测到健康风险时通知',
      value: data?.data?.healthAlert ?? false,
    },
    {
      key: 'dietPlanUpdate',
      title: '饮食计划更新',
      description: '饮食计划有更新时通知',
      value: data?.data?.dietPlanUpdate ?? false,
    },
    {
      key: 'weeklyReport',
      title: '周报告',
      description: '每周健康数据分析报告',
      value: data?.data?.weeklyReport ?? false,
    },
    {
      key: 'systemNotice',
      title: '系统通知',
      description: '系统维护、版本更新等通知',
      value: data?.data?.systemNotice ?? false,
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知设置</Text>
        <Text style={styles.sectionDesc}>
          设置您希望接收的通知类型，我们会通过消息中心和推送通知的方式通知您
        </Text>
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
        <Text style={styles.footerText}>
          注意：关闭通知可能会导致您错过重要信息。建议至少开启预约提醒和健康预警通知。
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
  footerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
