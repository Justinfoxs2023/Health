import { IQuestLine } from '../types/gamification/quest.types';

export const QUEST_LINES: IQuestLine[] = [
  // 主线任务
  {
    id: 'main_health_journey',
    name: '健康成长之路',
    type: 'main',
    description: '开启您的健康管理之旅',
    chapters: [
      {
        id: 'chapter_1',
        name: '健康启程',
        quests: [
          {
            id: 'setup_profile',
            type: 'main',
            name: '创建健康档案',
            description: '完善您的个人健康信息',
            requirements: { level: 1 },
            objectives: [
              {
                id: 'basic_info',
                type: 'profile_completion',
                target: 100,
                current: 0,
                description: '填写基本信息',
              },
            ],
            rewards: [
              { type: 'exp', value: 100 },
              { type: 'feature', value: 'health_tracking' },
            ],
            repeatable: false,
          },
        ],
      },
      {
        id: 'chapter_2',
        name: '运动起步',
        requirements: { level: 3 },
        quests: [
          {
            id: 'first_exercise',
            type: 'main',
            name: '首次运动记录',
            description: '记录您的第一次运动数据',
            requirements: {},
            objectives: [
              {
                id: 'record_exercise',
                type: 'exercise_record',
                target: 1,
                current: 0,
                description: '记录一次运动',
              },
            ],
            rewards: [
              { type: 'exp', value: 150 },
              { type: 'feature', value: 'exercise_tracking' },
            ],
            repeatable: false,
          },
        ],
      },
    ],
  },

  // 角色任务线 - 专家
  {
    id: 'expert_growth',
    name: '专家成长之路',
    type: 'role',
    description: '成为健康领域的专业人士',
    requirements: { level: 10 },
    chapters: [
      {
        id: 'expert_ch1',
        name: '专业起步',
        quests: [
          {
            id: 'expert_certification',
            type: 'role',
            name: '专业认证',
            description: '完成专业资质认证',
            requirements: {},
            objectives: [
              {
                id: 'upload_cert',
                type: 'certification',
                target: 1,
                current: 0,
                description: '上传专业书',
              },
            ],
            rewards: [
              { type: 'title', value: 'certified_expert' },
              { type: 'feature', value: 'expert_consultation' },
            ],
            repeatable: false,
          },
        ],
      },
    ],
  },

  // 日常任务线
  {
    id: 'daily_health',
    name: '日常健康养成',
    type: 'daily',
    description: '培养健康生活习惯',
    chapters: [
      {
        id: 'daily_tasks',
        name: '每日任务',
        quests: [
          {
            id: 'daily_exercise',
            type: 'daily',
            name: '日常运动',
            description: '完成每日运动目标',
            requirements: {},
            objectives: [
              {
                id: 'steps',
                type: 'step_count',
                target: 8000,
                current: 0,
                description: '达到每日步数目标',
              },
            ],
            rewards: [
              { type: 'exp', value: 50 },
              { type: 'points', value: 100 },
            ],
            repeatable: true,
          },
        ],
      },
    ],
  },
];
