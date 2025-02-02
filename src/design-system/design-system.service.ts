import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../infrastructure/logger/logger.service';
import { Theme, AccessibilityConfig } from './types';
import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

@Injectable()
export class DesignSystemService implements OnModuleInit {
  private readonly currentTheme = new Subject<Theme>();
  private readonly accessibilityConfig = new Subject<AccessibilityConfig>();
  private themes: Map<string, Theme> = new Map();

  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger
  ) {}

  async onModuleInit() {
    await this.initializeThemes();
    await this.initializeAccessibility();
  }

  // 主题管理
  private async initializeThemes() {
    // 加载预设主题
    const defaultThemes = await this.loadDefaultThemes();
    defaultThemes.forEach(theme => this.themes.set(theme.id, theme));

    // 加载用户自定义主题
    const customThemes = await this.loadCustomThemes();
    customThemes.forEach(theme => this.themes.set(theme.id, theme));

    // 设置当前主题
    const savedThemeId = localStorage.getItem('currentThemeId');
    if (savedThemeId && this.themes.has(savedThemeId)) {
      this.setTheme(savedThemeId);
    } else {
      this.setTheme(this.getDefaultThemeId());
    }
  }

  // 无障碍配置
  private async initializeAccessibility() {
    const savedConfig = localStorage.getItem('accessibilityConfig');
    if (savedConfig) {
      this.setAccessibilityConfig(JSON.parse(savedConfig));
    } else {
      this.setAccessibilityConfig(this.getDefaultAccessibilityConfig());
    }
  }

  // 主题相关方法
  getTheme(themeId: string): Theme {
    return this.themes.get(themeId);
  }

  getCurrentTheme(): Observable<Theme> {
    return this.currentTheme.asObservable();
  }

  async setTheme(themeId: string): Promise<void> {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }

    this.currentTheme.next(theme);
    localStorage.setItem('currentThemeId', themeId);
    this.applyTheme(theme);
  }

  async createCustomTheme(theme: Partial<Theme>): Promise<string> {
    const newTheme = {
      ...this.getDefaultTheme(),
      ...theme,
      id: `custom-${Date.now()}`,
      type: 'custom'
    };

    this.themes.set(newTheme.id, newTheme);
    await this.saveCustomThemes();
    return newTheme.id;
  }

  async updateTheme(themeId: string, updates: Partial<Theme>): Promise<void> {
    const theme = this.themes.get(themeId);
    if (!theme || theme.type !== 'custom') {
      throw new Error('Cannot update non-custom theme');
    }

    const updatedTheme = { ...theme, ...updates };
    this.themes.set(themeId, updatedTheme);
    await this.saveCustomThemes();

    if (this.currentTheme.value.id === themeId) {
      this.currentTheme.next(updatedTheme);
    }
  }

  // 无障碍相关方法
  getAccessibilityConfig(): Observable<AccessibilityConfig> {
    return this.accessibilityConfig.asObservable();
  }

  async setAccessibilityConfig(config: Partial<AccessibilityConfig>): Promise<void> {
    const newConfig = {
      ...this.accessibilityConfig.value,
      ...config
    };

    this.accessibilityConfig.next(newConfig);
    localStorage.setItem('accessibilityConfig', JSON.stringify(newConfig));
    this.applyAccessibilityConfig(newConfig);
  }

  // 辅助方法
  private async loadDefaultThemes(): Promise<Theme[]> {
    // 实现加载预设主题的逻辑
    return [];
  }

  private async loadCustomThemes(): Promise<Theme[]> {
    // 实现加载自定义主题的逻辑
    return [];
  }

  private async saveCustomThemes(): Promise<void> {
    // 实现保存自定义主题的逻辑
  }

  private getDefaultThemeId(): string {
    // 实现获取默认主题ID的逻辑
    return '';
  }

  private getDefaultTheme(): Theme {
    // 实现获取默认主题的逻辑
    return null;
  }

  private getDefaultAccessibilityConfig(): AccessibilityConfig {
    // 实现获取默认无障碍配置的逻辑
    return null;
  }

  private applyTheme(theme: Theme): void {
    // 实现应用主题的逻辑
    document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
    // ... 设置其他CSS变量
  }

  private applyAccessibilityConfig(config: AccessibilityConfig): void {
    // 实现应用无障碍配置的逻辑
    if (config.visual.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    // ... 应用其他无障碍设置
  }
} 