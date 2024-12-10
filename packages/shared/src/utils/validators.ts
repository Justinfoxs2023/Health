import { z } from 'zod';

// 健康数据验证schema
export const healthDataSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  timestamp: z.string().datetime(),
  metrics: z.record(z.number()),
  tags: z.array(z.string()).optional(),
});

// 健康目标验证schema
export const healthGoalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  target: z.number().positive(),
  unit: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  milestones: z.array(
    z.object({
      title: z.string(),
      value: z.number().positive(),
    })
  ).optional(),
});

export const validateHealthData = (data: unknown) => {
  try {
    return healthDataSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`数据验证失败: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

export const validateHealthGoal = (goal: unknown) => {
  try {
    return healthGoalSchema.parse(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`目标验证失败: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}; 