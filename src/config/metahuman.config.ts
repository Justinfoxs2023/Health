/**
 * @fileoverview TS 文件 metahuman.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const METAHUMAN_CONFIG = {
  // 数字人模型配置
  models: {
    default: {
      type: 'ernerf',
      modelPath: '/models/default',
      animations: {
        idle: '/animations/idle',
        talking: '/animations/talking',
        listening: '/animations/listening',
      },
    },
    doctor: {
      type: 'musetalk',
      modelPath: '/models/doctor',
      animations: {
        consulting: '/animations/consulting',
        explaining: '/animations/explaining',
      },
    },
  },

  // 视频渲染设置
  rendering: {
    resolution: '1080p',
    fps: 30,
    quality: 'high',
    background: 'blur',
  },

  // 音频合成配置
  voice: {
    engine: 'synctalk',
    sampleRate: 48000,
    modelPath: '/voice/models',
  },

  // 动作捕捉配置
  motionCapture: {
    face: true,
    body: true,
    hands: true,
    updateRate: 60,
  },
};
