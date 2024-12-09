import { Vibration, Platform } from 'react-native';
import Sound from 'react-native-sound';

export class FeedbackSystem {
  // 触觉反馈模式
  static readonly hapticPatterns = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10],
    error: [50, 100, 50],
    warning: [30, 60, 30]
  };

  // 声音反馈
  private static sounds: Record<string, Sound> = {};

  // 初始化声音
  static initSounds() {
    const soundFiles = {
      tap: require('../../assets/sounds/tap.mp3'),
      success: require('../../assets/sounds/success.mp3'),
      error: require('../../assets/sounds/error.mp3'),
      notification: require('../../assets/sounds/notification.mp3')
    };

    Object.entries(soundFiles).forEach(([key, file]) => {
      this.sounds[key] = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.error(`Failed to load sound ${key}:`, error);
        }
      });
    });
  }

  // 触觉反馈
  static haptic(pattern: keyof typeof FeedbackSystem.hapticPatterns) {
    if (Platform.OS === 'ios') {
      // iOS使用原生触觉引擎
      // 需要添加react-native-haptic-feedback依赖
    } else {
      Vibration.vibrate(this.hapticPatterns[pattern]);
    }
  }

  // 声音反馈
  static playSound(soundName: keyof typeof FeedbackSystem.sounds) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play((success) => {
        if (!success) {
          console.error(`Failed to play sound ${soundName}`);
        }
      });
    }
  }

  // 组合反馈
  static feedback(options: {
    haptic?: keyof typeof FeedbackSystem.hapticPatterns;
    sound?: keyof typeof FeedbackSystem.sounds;
  }) {
    if (options.haptic) {
      this.haptic(options.haptic);
    }
    if (options.sound) {
      this.playSound(options.sound);
    }
  }
} 