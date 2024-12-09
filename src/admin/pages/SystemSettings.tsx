import React, { useState, useEffect } from 'react';
import { 
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  message 
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SystemConfigType } from '@/types/system-config';
import { 
  getSystemConfig,
  updateSystemConfig,
  exportSystemConfig,
  importSystemConfig 
} from '@/store/actions/system';
import { ConfigPanel } from '@/components/ConfigPanel';
import { PermissionGuard } from '@/components/PermissionGuard';

export const SystemSettings = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('storage');
  const [loading, setLoading] = useState(false);
  
  const systemConfig = useSelector(state => state.system.config);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      await dispatch(getSystemConfig());
    } catch (error) {
      message.error('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (type: SystemConfigType, values: any) => {
    try {
      setLoading(true);
      await dispatch(updateSystemConfig(type, values));
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const config = await dispatch(exportSystemConfig());
      // 实现配置导出逻辑
    } catch (error) {
      message.error('导出失败');
    }
  };

  const handleImport = async (file: File) => {
    try {
      // 实现配置导入逻辑
      await dispatch(importSystemConfig(config));
      message.success('导入成功');
    } catch (error) {
      message.error('导入失败');
    }
  };

  return (
    <Card title="系统设置" loading={loading}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 存储设置 */}
        <Tabs.TabPane tab="存储设置" key="storage">
          <ConfigPanel
            type={SystemConfigType.STORAGE}
            config={systemConfig.storage}
            onSave={values => handleConfigUpdate(SystemConfigType.STORAGE, values)}
          />
        </Tabs.TabPane>

        {/* AI功能设置 */}
        <Tabs.TabPane tab="AI功能设置" key="ai">
          <ConfigPanel
            type={SystemConfigType.AI}
            config={systemConfig.ai}
            onSave={values => handleConfigUpdate(SystemConfigType.AI, values)}
          />
        </Tabs.TabPane>

        {/* 安全设置 */}
        <Tabs.TabPane tab="安全设置" key="security">
          <ConfigPanel
            type={SystemConfigType.SECURITY}
            config={systemConfig.security}
            onSave={values => handleConfigUpdate(SystemConfigType.SECURITY, values)}
          />
        </Tabs.TabPane>

        {/* 其他设置标签页 */}
      </Tabs>

      <div style={{ marginTop: 24 }}>
        <Button onClick={handleExport}>导出配置</Button>
        <Button style={{ marginLeft: 8 }}>导入配置</Button>
      </div>
    </Card>
  );
}; 