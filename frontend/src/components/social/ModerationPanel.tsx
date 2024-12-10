import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message
} from 'antd';
import { useTranslation } from 'react-i18next';
import { ModerationService } from '@/services/ModerationService';
import { useAuth } from '@/hooks/useAuth';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export const ModerationPanel: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [moderations, setModerations] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [ruleModal, setRuleModal] = useState({
    visible: false,
    type: 'create',
    data: null
  });
  const [form] = Form.useForm();

  const loadModerations = async (page = 1) => {
    try {
      setLoading(true);
      const response = await ModerationService.getPendingModerations(page, pagination.pageSize);
      setModerations(response.items);
      setPagination({
        ...pagination,
        current: page,
        total: response.total
      });
    } catch (error) {
      message.error(t('moderation.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async (page = 1) => {
    try {
      setLoading(true);
      const response = await ModerationService.getModerationRules(page, pagination.pageSize);
      setRules(response.items);
      setPagination({
        ...pagination,
        current: page,
        total: response.total
      });
    } catch (error) {
      message.error(t('moderation.rulesLoadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      loadModerations();
    } else {
      loadRules();
    }
  }, [activeTab]);

  const handleReview = async (id: string, decision: 'approved' | 'rejected', reason?: string) => {
    try {
      await ModerationService.reviewModeration(id, user.id, decision, reason);
      message.success(t('moderation.reviewSuccess'));
      loadModerations(pagination.current);
    } catch (error) {
      message.error(t('moderation.reviewError'));
    }
  };

  const handleRuleSubmit = async (values: any) => {
    try {
      if (ruleModal.type === 'create') {
        await ModerationService.createModerationRule(values);
        message.success(t('moderation.ruleCreateSuccess'));
      } else {
        await ModerationService.updateModerationRule(ruleModal.data._id, values);
        message.success(t('moderation.ruleUpdateSuccess'));
      }
      setRuleModal({ visible: false, type: 'create', data: null });
      form.resetFields();
      loadRules(pagination.current);
    } catch (error) {
      message.error(t('moderation.ruleSaveError'));
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await ModerationService.deleteModerationRule(id);
      message.success(t('moderation.ruleDeleteSuccess'));
      loadRules(pagination.current);
    } catch (error) {
      message.error(t('moderation.ruleDeleteError'));
    }
  };

  const moderationColumns = [
    {
      title: t('moderation.content'),
      dataIndex: ['metadata', 'content'],
      ellipsis: true
    },
    {
      title: t('moderation.type'),
      dataIndex: 'target_type',
      render: (type: string) => (
        <Tag color={type === 'post' ? 'blue' : 'green'}>
          {t(`moderation.${type}`)}
        </Tag>
      )
    },
    {
      title: t('moderation.rule'),
      dataIndex: ['rule_id', 'name']
    },
    {
      title: t('moderation.createdAt'),
      dataIndex: 'created_at',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: t('moderation.actions'),
      render: (record: any) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleReview(record._id, 'approved')}
          >
            {t('moderation.approve')}
          </Button>
          <Button
            danger
            onClick={() => handleReview(record._id, 'rejected')}
          >
            {t('moderation.reject')}
          </Button>
        </Space>
      )
    }
  ];

  const ruleColumns = [
    {
      title: t('moderation.ruleName'),
      dataIndex: 'name'
    },
    {
      title: t('moderation.ruleType'),
      dataIndex: 'type',
      render: (type: string) => (
        <Tag color={type === 'keyword' ? 'blue' : type === 'regex' ? 'green' : 'purple'}>
          {t(`moderation.${type}`)}
        </Tag>
      )
    },
    {
      title: t('moderation.ruleAction'),
      dataIndex: 'action',
      render: (action: string) => (
        <Tag color={action === 'block' ? 'red' : action === 'flag' ? 'orange' : 'blue'}>
          {t(`moderation.${action}`)}
        </Tag>
      )
    },
    {
      title: t('moderation.status'),
      dataIndex: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? t('common.active') : t('common.inactive')}
        </Tag>
      )
    },
    {
      title: t('common.actions'),
      render: (record: any) => (
        <Space>
          <Button
            onClick={() => {
              form.setFieldsValue(record);
              setRuleModal({
                visible: true,
                type: 'edit',
                data: record
              });
            }}
          >
            {t('common.edit')}
          </Button>
          <Button
            danger
            onClick={() => handleDeleteRule(record._id)}
          >
            {t('common.delete')}
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Card title={t('moderation.title')}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={t('moderation.pendingTab')} key="pending">
          <Table
            columns={moderationColumns}
            dataSource={moderations}
            loading={loading}
            pagination={pagination}
            onChange={({ current }) => loadModerations(current)}
            rowKey="_id"
          />
        </TabPane>
        <TabPane tab={t('moderation.rulesTab')} key="rules">
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => setRuleModal({ visible: true, type: 'create', data: null })}
            >
              {t('moderation.createRule')}
            </Button>
          </div>
          <Table
            columns={ruleColumns}
            dataSource={rules}
            loading={loading}
            pagination={pagination}
            onChange={({ current }) => loadRules(current)}
            rowKey="_id"
          />
        </TabPane>
      </Tabs>

      <Modal
        title={t(
          ruleModal.type === 'create'
            ? 'moderation.createRule'
            : 'moderation.editRule'
        )}
        visible={ruleModal.visible}
        onCancel={() => {
          setRuleModal({ visible: false, type: 'create', data: null });
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRuleSubmit}
        >
          <Form.Item
            name="name"
            label={t('moderation.ruleName')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('moderation.ruleDescription')}
            rules={[{ required: true }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="type"
            label={t('moderation.ruleType')}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="keyword">{t('moderation.keyword')}</Option>
              <Option value="regex">{t('moderation.regex')}</Option>
              <Option value="ai">{t('moderation.ai')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="action"
            label={t('moderation.ruleAction')}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="block">{t('moderation.block')}</Option>
              <Option value="flag">{t('moderation.flag')}</Option>
              <Option value="notify">{t('moderation.notify')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['criteria', 'keywords']}
            label={t('moderation.keywords')}
            rules={[{ required: true }]}
          >
            <Select mode="tags" />
          </Form.Item>
          <Form.Item
            name="is_active"
            valuePropName="checked"
            label={t('moderation.isActive')}
          >
            <Select>
              <Option value={true}>{t('common.active')}</Option>
              <Option value={false}>{t('common.inactive')}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}; 