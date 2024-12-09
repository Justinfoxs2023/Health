import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Switch } from 'react-native';
import { useQuery, useMutation } from 'react-query';
import { getSettings, updateSettings } from '../../api/user';
import { LoadingSpinner, AlertDialog } from '../../components';

export const SettingsScreen = ({ navigation }) => {
  const { data, isLoading } = useQuery('settings', getSettings);
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);

  const mutation = useMutation(updateSettings);

  const handleToggle = (key: string, value: boolean) => {
    mutation.mutate({
      [key]: value
    });
  };

  if (isLoading) return <LoadingSpinner />;

  const settings = data?.data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知设置</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>咨询提醒</Text>
          <Switch
            value={settings.consultationNotification}
            onValueChange={(value) => handleToggle('consultationNotification', value)}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={settings.consultationNotification ? '#2E7D32' : '#fff'}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>健康提醒</Text>
          <Switch
            value={settings.healthNotification}
            onValueChange={(value) => handleToggle('healthNotification', value)}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={settings.healthNotification ? '#2E7D32' : '#fff'}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>饮食计划提醒</Text>
          <Switch
            value={settings.dietPlanNotification}
            onValueChange={(value) => handleToggle('dietPlanNotification', value)}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={settings.dietPlanNotification ? '#2E7D32' : '#fff'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>隐私设置</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>公开健康数据</Text>
          <Switch
            value={settings.publicHealthData}
            onValueChange={(value) => handleToggle('publicHealthData', value)}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={settings.publicHealthData ? '#2E7D32' : '#fff'}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>允许推荐</Text>
          <Switch
            value={settings.allowRecommendation}
            onValueChange={(value) => handleToggle('allowRecommendation', value)}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={settings.allowRecommendation ? '#2E7D32' : '#fff'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账号安全</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={styles.menuText}>修改密码</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BindPhone')}
        >
          <Text style={styles.menuText}>绑定手机</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>其他</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.menuText}>关于我们</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Privacy')}
        >
          <Text style={styles.menuText}>隐私政策</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Terms')}
        >
          <Text style={styles.menuText}>用户协议</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setShowLogoutAlert(true)}
      >
        <Text style={styles.logoutButtonText}>退出登录</Text>
      </TouchableOpacity>

      <AlertDialog
        visible={showLogoutAlert}
        title="退出登录"
        message="确定要退出登录吗？"
        onConfirm={() => {
          // 处理退出登录
          setShowLogoutAlert(false);
        }}
        onCancel={() => setShowLogoutAlert(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  section: {
    marginTop: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 15
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  settingLabel: {
    fontSize: 16,
    color: '#333'
  },
  menuItem: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  menuText: {
    fontSize: 16,
    color: '#333'
  },
  logoutButton: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold'
  }
}); 