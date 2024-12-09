import React from 'react';
import { Card, List, Avatar, Button, Modal, Form, Input } from 'antd';
import { useQuery } from 'react-query';
import { getExperts, requestConsultation } from '../../services/consultation.service';

export const ExpertConsultation: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [selectedExpert, setSelectedExpert] = React.useState<any>(null);
  const { data: experts } = useQuery('healthExperts', getExperts);
  const [form] = Form.useForm();

  const handleConsultation = async (values: any) => {
    try {
      await requestConsultation({
        expertId: selectedExpert.id,
        ...values
      });
      setVisible(false);
    } catch (error) {
      console.error('预约失败:', error);
    }
  };

  return (
    <Card title="专家咨询">
      <List
        itemLayout="horizontal"
        dataSource={experts}
        renderItem={expert => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                onClick={() => {
                  setSelectedExpert(expert);
                  setVisible(true);
                }}
              >
                预约咨询
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={expert.avatar} />}
              title={expert.name}
              description={expert.specialization}
            />
          </List.Item>
        )}
      />

      <Modal
        title="预约咨询"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleConsultation}>
          <Form.Item
            name="consultationType"
            label="咨询类型"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="问题描述"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交预约
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}; 