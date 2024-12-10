import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider } from 'react-native-paper';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../hooks/useAuth';

export const SettingsScreen = () => {
  const { settings, updateSettings } = useSettings();
  const { logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>通知设置</List.Subheader>
        <List.Item
          title="推送通知"
          right={() => (
            <Switch
              value={settings.pushEnabled}
              onValueChange={(value) => 
                updateSettings({ pushEnabled: value })
              }
            />
          )}
        />
        <List.Item
          title="邮件通知"
          right={() => (
            <Switch
              value={settings.emailEnabled}
              onValueChange={(value) => 
                updateSettings({ emailEnabled: value })
              }
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>安全设置</List.Subheader>
        <List.Item
          title="生物识别"
          right={() => (
            <Switch
              value={settings.biometricEnabled}
              onValueChange={(value) => 
                updateSettings({ biometricEnabled: value })
              }
            />
          )}
        />
        <List.Item
          title="修改密码"
          onPress={() => {/* 导航到修改密码页面 */}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Item
          title="退出登录"
          onPress={logout}
          titleStyle={styles.logoutText}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoutText: {
    color: 'red',
  },
}); 