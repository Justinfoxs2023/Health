import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet,
  Switch,
  TouchableOpacity 
} from 'react-native';
import { 
  Text,
  List,
  Dialog,
  Portal,
  Button 
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SystemConfigType } from '@/types/system-config';
import { updateSystemConfig } from '@/store/actions/system';
import { SettingSection } from '@/components/SettingSection';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTheme } from '@/hooks/useTheme';

export const SettingsScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SystemConfigType | null>(null);
  
  const systemConfig = useSelector(state => state.system.config);

  // 处理设置更新
  const handleConfigUpdate = async (type: SystemConfigType, value: any) => {
    try {
      setLoading(true);
      await dispatch(updateSystemConfig(type, value));
    } catch (error) {
      console.error('Failed to update config:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingSpinner visible={loading} />
      
      {/* 存储设置 */}
      <SettingSection
        title="存储设置"
        icon="folder"
        onPress={() => setSelectedSection(SystemConfigType.STORAGE)}
      >
        <List.Item
          title="启用文件压缩"
          right={() => (
            <Switch
              value={systemConfig.storage.compression}
              onValueChange={value => 
                handleConfigUpdate(SystemConfigType.STORAGE, {
                  compression: value
                })
              }
            />
          )}
        />
        {/* 其他存储相关设置 */}
      </SettingSection>

      {/* AI功能设置 */}
      <SettingSection
        title="AI功能设置"
        icon="brain"
        onPress={() => setSelectedSection(SystemConfigType.AI)}
      >
        <List.Item
          title="启用食物识别"
          right={() => (
            <Switch
              value={systemConfig.ai.foodRecognition}
              onValueChange={value =>
                handleConfigUpdate(SystemConfigType.AI, {
                  foodRecognition: value
                })
              }
            />
          )}
        />
        {/* 其他AI功能设置 */}
      </SettingSection>

      {/* 安全设置 */}
      <SettingSection
        title="安全设置"
        icon="shield"
        onPress={() => setSelectedSection(SystemConfigType.SECURITY)}
      >
        <List.Item
          title="两步验证"
          right={() => (
            <Switch
              value={systemConfig.security.twoFactorAuth}
              onValueChange={value =>
                handleConfigUpdate(SystemConfigType.SECURITY, {
                  twoFactorAuth: value
                })
              }
            />
          )}
        />
        {/* 其他安全设置 */}
      </SettingSection>

      {/* 通知设置 */}
      <SettingSection
        title="通知设置"
        icon="bell"
        onPress={() => setSelectedSection(SystemConfigType.NOTIFICATION)}
      >
        {/* 通知设置项 */}
      </SettingSection>

      {/* 性能设置 */}
      <SettingSection
        title="性能设置"
        icon="speedometer"
        onPress={() => setSelectedSection(SystemConfigType.PERFORMANCE)}
      >
        {/* 性能设置项 */}
      </SettingSection>

      {/* 设置详情对话框 */}
      <Portal>
        <Dialog
          visible={!!selectedSection}
          onDismiss={() => setSelectedSection(null)}
        >
          <Dialog.Title>
            {selectedSection && `${selectedSection} 设置`}
          </Dialog.Title>
          <Dialog.Content>
            {/* 根据selectedSection渲染对应的详细设置 */}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSelectedSection(null)}>关闭</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
}); 