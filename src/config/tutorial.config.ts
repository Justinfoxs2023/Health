import { ITutorialConfig } from '../types/gamification/tutorial.types';

export const TUTORIAL_CONFIG: ITutorialConfig = {
  steps: [
    {
      id: 'welcome',
      title: '欢迎来到健康助手',
      description: '让我们开始健康管理之旅吧！',
      target: 'app-root',
      position: 'top',
      reward: {
        exp: 50,
        points: 100,
        items: ['newbie_guide'],
      },
    },
    {
      id: 'health_record',
      title: '记录健康数据',
      description: '点击这里记录你的第一份健康数据',
      target: 'health-record-btn',
      position: 'bottom',
      action: {
        type: 'click',
      },
      reward: {
        exp: 100,
        points: 150,
      },
    },
    {
      id: 'daily_task',
      title: '完成每日任务',
      description: '查看今天的健康任务',
      target: 'daily-tasks-panel',
      position: 'right',
      action: {
        type: 'click',
      },
      reward: {
        exp: 150,
        points: 200,
        items: ['task_guide'],
      },
    },
  ],

  newUserBenefits: {
    duration: 7,
    multipliers: {
      exp: 2.0,
      points: 1.5,
    },
    dailyRewards: {
      exp: 200,
      points: 300,
      items: ['daily_bonus_pack'],
    },
  },
};
