import React, { useState } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder
}) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { content: string }) => {
    try {
      setSubmitting(true);
      await onSubmit(values.content);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="content"
        rules={[
          {
            required: true,
            message: t('comments.contentRequired')
          }
        ]}
      >
        <Input.TextArea
          rows={4}
          placeholder={placeholder || t('comments.placeholder')}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            {t('comments.submit')}
          </Button>
          {onCancel && (
            <Button onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}; 