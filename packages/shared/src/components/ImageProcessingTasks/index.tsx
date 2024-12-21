import React, { useEffect, useState } from 'react';

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { DeleteOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import { ImageProcessingService } from '../../services/imageProcessing';
import { Table, Tag, Progress, Button, Space, Modal, message } from 'antd';

dayjs.locale('zh-cn');

interface ImageProcessingTasksProps {
  /** imageProcessingService 的描述 */
  imageProcessingService: ImageProcessingService;
  /** className 的描述 */
  className?: string;
  /** style 的描述 */
  style?: React.CSSProperties;
}

export const ImageProcessingTasks: React.FC<ImageProcessingTasksProps> = ({
  imageProcessingService,
  className,
  style,
}) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscription = imageProcessingService.getState().subscribe(state => {
      setTasks(state.tasks);
      setLoading(state.processing);
    });

    return () => subscription.unsubscribe();
  }, [imageProcessingService]);

  const handleCancel = (taskId: string) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消这个任务吗？',
      onOk: () => {
        imageProcessingService.cancelTask(taskId);
        message.success('任务已取消');
      },
    });
  };

  const handleClearCompleted = () => {
    Modal.confirm({
      title: '确认清理',
      content: '确定要清理所有已完成的任务吗？',
      onOk: () => {
        imageProcessingService.clearCompletedTasks();
        message.success('已清理完成的任务');
      },
    });
  };

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          compress: '压缩',
          convert: '转换',
          resize: '调整大小',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'default', text: '等待中' },
          processing: { color: 'processing', text: '处理中' },
          completed: { color: 'success', text: '已完成' },
          failed: { color: 'error', text: '失败' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      render: (progress: number, record: any) => (
        <Progress
          percent={Math.round(progress)}
          size="small"
          status={record.status === 'failed' ? 'exception' : undefined}
          showInfo={record.status !== 'pending'}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '完成时间',
      dataIndex: 'completedAt',
      key: 'completedAt',
      width: 200,
      render: (date: Date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '错误信息',
      dataIndex: 'error',
      key: 'error',
      ellipsis: true,
      render: (error: string) => error || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record: any) => (
        <Space>
          {(record.status === 'pending' || record.status === 'processing') && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleCancel(record.id)}
            >
              取消
            </Button>
          )}
          {record.status === 'failed' && (
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={() => {
                // TODO: 实现重试功能
                message.info('重试功能开发中');
              }}
            >
              重试
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={className} style={style}>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          icon={<ClearOutlined />}
          onClick={handleClearCompleted}
          disabled={!tasks.some(task => task.status === 'completed')}
        >
          清理已完成
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`,
        }}
      />
    </div>
  );
};
