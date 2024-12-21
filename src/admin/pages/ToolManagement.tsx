import React, { useState, useEffect } from 'react';

import { Table, Card, Button, Switch, Modal, Form, Input, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { ToolConfigForm } from '@/components/ToolConfigForm';
import { ToolStatsChart } from '@/components/ToolStatsChart';
import { ToolType, ToolCategory, IToolFeature } from '@/types/tool-features';
import { fetchAllTools, updateToolConfig, getToolStats } from '@/store/actions/tools';

export const ToolManagement = () => {
  const [selectedTool, setSelectedTool] = useState<IToolFeature | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const tools = useSelector(state => state.admin.tools);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      await dispatch(fetchAllTools());
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (toolType: ToolType, config: Partial<IToolFeature>) => {
    try {
      await dispatch(updateToolConfig(toolType, config));
      message.success('工具配置已更新');
      setModalVisible(false);
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns = [
    {
      title: '工具名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: IToolFeature) => (
        <Switch
          checked={enabled}
          onChange={checked => handleConfigUpdate(record.type, { enabled: checked })}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: IToolFeature) => (
        <>
          <Button
            onClick={ => {
              setSelectedToolrecord
              setModalVisibletrue
            }}
          >
            
          </Button>
          <Button onClick={ => dispatchgetToolStatsrecordtype}></Button>
        </>
      ),
    },
  ];

  return (
    <Card title="工具管理">
      <Table loading={loading} dataSource={tools} columns={columns} rowKey="type" />

      <Modal
        title="工具配置"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTool && (
          <ToolConfigForm
            tool={selectedTool}
            onSubmit={values => handleConfigUpdate(selectedTool.type, values)}
          />
        )}
      </Modal>
    </Card>
  );
};
