import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Switch } from '../common';

interface DeviceConfig {
  id: string;
  name: string;
  settings: {
    [key: string]: {
      type: 'toggle' | 'select' | 'input';
      label: string;
      value: any;
      options?: string[];
    }
  }
}

interface Props {
  config: DeviceConfig;
  onSave: (config: DeviceConfig) => void;
}

export const DeviceConfigPanel: React.FC<Props> = ({ config, onSave }) => {
  const [settings, setSettings] = useState(config.settings);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }));
  };

  const handleSave = () => {
    onSave({
      ...config,
      settings
    });
  };

  return (
    <Card style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{config.name}设置</Text>
        
        {Object.entries(settings).map(([key, setting]) => (
          <View key={key} style={styles.settingItem}>
            <Text style={styles.label}>{setting.label}</Text>
            
            {setting.type === 'toggle' && (
              <Switch
                value={setting.value}
                onValueChange={(value) => handleSettingChange(key, value)}
              />
            )}
            
            {/* 添加其他设置类型的渲染逻辑 */}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="保存设置"
          onPress={handleSave}
          type="primary"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  }
}); 