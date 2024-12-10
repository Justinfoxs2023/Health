import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HealthDataForm } from '../index';
import { HealthDataType } from '../../../types';

describe('HealthDataForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染表单字段', () => {
    render(
      <HealthDataForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    expect(screen.getByLabelText(/数据类型/)).toBeInTheDocument();
    expect(screen.getByLabelText(/数值/)).toBeInTheDocument();
    expect(screen.getByLabelText(/单位/)).toBeInTheDocument();
    expect(screen.getByLabelText(/备注/)).toBeInTheDocument();
  });

  it('应该使用初始值正确渲染', () => {
    const initialData = {
      type: HealthDataType.BLOOD_PRESSURE,
      value: 120,
      unit: 'mmHg',
      note: '测试备注'
    };

    render(
      <HealthDataForm
        initialData={initialData}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    expect(screen.getByDisplayValue('blood_pressure')).toBeInTheDocument();
    expect(screen.getByDisplayValue('120')).toBeInTheDocument();
    expect(screen.getByDisplayValue('mmHg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('测试备注')).toBeInTheDocument();
  });

  it('应该在提交时验证必填字段', async () => {
    render(
      <HealthDataForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    fireEvent.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(screen.getByText(/数值必须大于0/)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('应该在表单验证通过后调用onSubmit', async () => {
    render(
      <HealthDataForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    fireEvent.change(screen.getByLabelText(/数据类型/), {
      target: { value: HealthDataType.BLOOD_PRESSURE }
    });
    fireEvent.change(screen.getByLabelText(/数值/), {
      target: { value: '120' }
    });
    fireEvent.change(screen.getByLabelText(/单位/), {
      target: { value: 'mmHg' }
    });

    fireEvent.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        type: HealthDataType.BLOOD_PRESSURE,
        value: 120,
        unit: 'mmHg',
        note: '',
        timestamp: expect.any(Date)
      });
    });
  });

  it('应该在点击取消按钮时调用onCancel', () => {
    render(
      <HealthDataForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    fireEvent.click(screen.getByText('取消'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('应该在加载状态下禁用按钮', () => {
    render(
      <HealthDataForm
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        loading={true}
      />
    );

    expect(screen.getByText('提交')).toBeDisabled();
    expect(screen.getByText('取消')).toBeDisabled();
  });
}); 