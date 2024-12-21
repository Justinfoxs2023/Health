import React from 'react';

import { Button } from '../Button';
import { Form, FormItem } from '../Form';
import { HEALTH_THRESHOLDS } from '../../constants';
import { IHealthData, HealthDataType } from '../../types';
import { Input } from '../Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const healthDataSchema = z.object({
  type: z.nativeEnum(HealthDataType),
  value: z.number().min(0, '数值必须大于0').max(1000, '数值超出合理范围'),
  unit: z.string(),
  note: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
});

export type HealthDataFormDataType = z.infer<typeof healthDataSchema>;

export interface IHealthDataFormProps {
  /** 初始数据 */
  initialData?: Partial<IHealthData>;
  /** 提交回调 */
  onSubmit: (data: HealthDataFormDataType) => Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
  /** 加载状态 */
  loading?: boolean;
}

/** 健康数据录入表单 */
export const HealthDataForm: React.FC<IHealthDataFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const getThresholdMessage = (type: HealthDataType, value: number): string => {
    const threshold = HEALTH_THRESHOLDS[type];
    if (!threshold) return '';

    switch (type) {
      case HealthDataType.BLOOD_PRESSURE:
        if (value > threshold.SYSTOLIC.MAX) return '血压偏高';
        if (value < threshold.SYSTOLIC.MIN) return '血压偏低';
        break;
      case HealthDataType.HEART_RATE:
        if (value > threshold.MAX) return '心率偏快';
        if (value < threshold.MIN) return '心率偏慢';
        break;
      // ... 其他类型的阈值判断
    }
    return '';
  };

  return (
    <Form<HealthDataFormDataType>
      defaultValues={initialData}
      schema={healthDataSchema}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <FormItem label="数据类型" required>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          name="type"
        >
          {Object.values(HealthDataType).map(type => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </FormItem>

      <FormItem label="数值" required>
        <Input
          type="number"
          name="value"
          placeholder="请输入数值"
          block
          helpText={getThresholdMessage(
            initialData?.type || HealthDataType.BLOOD_PRESSURE,
            Number(initialData?.value) || 0,
          )}
        />
      </FormItem>

      <FormItem label="单位" required>
        <Input name="unit" placeholder="请输入单位" block />
      </FormItem>

      <FormItem label="备注">
        <Input name="note" placeholder="请输入备注信息" block />
      </FormItem>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            取消
          </Button>
        )}
        <Button type="submit" loading={loading}>
          提交
        </Button>
      </div>
    </Form>
  );
};
