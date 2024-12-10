import React from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { shareHealthReport } from '../../services/health.service';

export const ShareReport: React.FC<{ reportId: string }> = ({ reportId }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);

  const handleShare = async (values: any) => {
    try {
      await shareHealthReport(reportId, values.email);
      message.success('报告已成功分享');
      setVisible(false);
    } catch (error) {
      message.error('分享失败，请重试');
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<ShareAltOutlined />}
        onClick={() => setVisible(true)}
      >
        分享报告
      </Button>
      <Modal
        title="分享健康报告"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleShare}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入接收者的邮箱地址" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              发送
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}; 