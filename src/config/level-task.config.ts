import { ILevelTaskConfig } from '../types/gamification/level-task.types';

export const LEVEL_TASKS: ILevelTaskConfig[] = [
  {
    id: 'first_health_record',
    type: 'daily',
    level: 1,
    name: '首次健康记录',
    description: '完成你的第一次健康数据记录',
    requirements: {
      action: 'health_record',
      target: 1,
    },
    rewards: {
      exp: 100,
      points: 50,
      items: ['newbie_guide'],
    },
  },
  {
    id: 'basic_exercise',
    type: 'daily',
    level: 1,
    name: '运动起步',
    description: '完成一次基础运动记录',
    requirements: {
      action: 'exercise_record',
      target: 1,
    },
    rewards: {
      exp: 100,
      points: 50,
      features: ['exercise_tracking'],
    },
  },
];
