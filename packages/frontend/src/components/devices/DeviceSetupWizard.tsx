import React, { useState } from 'react';

import { Card, Text, Icon, Button, Steps } from '../common';
import { View, StyleSheet, ScrollView, Image } from 'react-native';

interface IDeviceType {
  /** id 的描述 */
  id: string;
  /** category 的描述 */
  category: 'wearable' | 'home' | 'therapeutic';
  /** name 的描述 */
  name: string;
  /** model 的描述 */
  model: string;
  /** icon 的描述 */
  icon: string;
  /** features 的描述 */
  features: string[];
  /** instructions 的描述 */
  instructions: string[];
  /** connectMethod 的描述 */
  connectMethod: 'bluetooth' | 'wifi' | 'both';
}

interface IProps {
  /** onComplete 的描述 */
  onComplete: (deviceId: string) => void;
  /** onCancel 的描述 */
  onCancel: () => void;
}

export const DeviceSetupWizard: React.FC<IProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<IDeviceType | null>(null);
  const [scanning, setScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<any[]>([]);

  const steps = [
    { title: '选择设备类型', icon: 'devices' },
    { title: '连接设备', icon: 'bluetooth-searching' },
    { title: '设备配置', icon: 'settings' },
    { title: '完成设置', icon: 'check-circle' },
  ];

  const deviceTypes: IDeviceType[] = [
    {
      id: 'watch_1',
      category: 'wearable',
      name: '智能手表',
      model: 'Health Watch Pro',
      icon: 'watch',
      features: ['心率监测', '活动追踪', '睡眠分析'],
      instructions: ['打开手表电源', '进入蓝牙配对模式', '在APP中选择设备', '确认配对码'],
      connectMethod: 'bluetooth',
    },
    {
      id: 'band_1',
      category: 'wearable',
      name: '智能手环',
      model: 'Health Band Plus',
      icon: 'fitness-center',
      features: ['血压监测', '血氧监测', '体温监测'],
      instructions: ['长按手环开机', '等待蓝牙指示灯闪烁', '在APP中扫描设备', '完成配对'],
      connectMethod: 'bluetooth',
    },
    // 其他设备类型...
  ];

  const renderDeviceSelection = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>选择您要添加的设备类型</Text>
      {deviceTypes.map(device => (
        <TouchableOpacity
          key={device.id}
          style={[styles.deviceOption, selectedDevice?.id === device.id && styles.selectedDevice]}
          onPress={() => setSelectedDevice(device)}
        >
          <Icon name={device.icon} size={24} color="#2E7D32" />
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceModel}>{device.model}</Text>
          </View>
          <View style={styles.featuresList}>
            {device.features.map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDeviceConnection = () => (
    <View style={styles.content}>
      <Card style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>连接说明</Text>
        {selectedDevice?.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>{index + 1}</Text>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.scanSection}>
        {scanning ? (
          <View style={styles.scanningAnimation}>
            <Icon name="bluetooth-searching" size={48} color="#42A5F5" />
            <Text style={styles.scanningText}>正在搜索设备...</Text>
          </View>
        ) : (
          <Button
            title="开始扫描"
            icon="bluetooth-searching"
            onPress={() => setScanning(true)}
            type="solid"
          />
        )}
      </View>

      {foundDevices.length > 0 && (
        <View style={styles.devicesList}>
          <Text style={styles.devicesTitle}>发现的设备</Text>
          {foundDevices.map(device => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceItem}
              onPress={() => handleDeviceSelect(device)}
            >
              <Icon name="bluetooth" size={20} color="#42A5F5" />
              <Text style={styles.deviceItemName}>{device.name}</Text>
              <Text style={styles.signalStrength}>信号强度: {device.rssi}dBm</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderDeviceConfig = () => (
    <View style={styles.content}>
      <Card style={styles.configCard}>
        <Text style={styles.configTitle}>设备设置</Text>
        {/* 设备特定的配置选项 */}
      </Card>
    </View>
  );

  const renderCompletion = () => (
    <View style={styles.content}>
      <View style={styles.completionContainer}>
        <Icon name="check-circle" size={64} color="#66BB6A" />
        <Text style={styles.completionTitle}>设置完成！</Text>
        <Text style={styles.completionText}>
          您的设备已成功连接并配置完成。现在可以开始使用了。
        </Text>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderDeviceSelection();
      case 1:
        return renderDeviceConnection();
      case 2:
        return renderDeviceConfig();
      case 3:
        return renderCompletion();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>添加新设备</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
          <Icon name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <Steps steps={steps} current={currentStep} style={styles.steps} />

      {renderStepContent()}

      <View style={styles.footer}>
        {currentStep > 0 && (
          <Button
            title="上一步"
            icon="arrow-back"
            onPress={() => setCurrentStep(prev => prev - 1)}
            type="outline"
          />
        )}
        {currentStep < steps.length - 1 ? (
          <Button
            title="下一步"
            icon="arrow-forward"
            onPress={() => setCurrentStep(prev => prev + 1)}
            type="solid"
            disabled={!selectedDevice && currentStep === 0}
          />
        ) : (
          <Button
            title="完成"
            icon="check"
            onPress={() => onComplete(selectedDevice?.id || '')}
            type="solid"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  closeButton: {
    padding: 5,
  },
  steps: {
    marginVertical: 20,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  deviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  selectedDevice: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
    borderWidth: 1,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceModel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  featureTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  instructionCard: {
    padding: 15,
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
    color: '#2E7D32',
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 14,
    color: '#444',
  },
  scanSection: {
    alignItems: 'center',
    padding: 20,
  },
  scanningAnimation: {
    alignItems: 'center',
  },
  scanningText: {
    marginTop: 10,
    color: '#666',
  },
  devicesList: {
    marginTop: 20,
  },
  devicesTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  deviceItemName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  signalStrength: {
    fontSize: 12,
    color: '#666',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
    marginBottom: 10,
  },
  completionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
