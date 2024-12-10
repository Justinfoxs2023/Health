import React from 'react';
import { useTheme } from '../../services/theme';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';

interface ThemeSwitchProps {
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/** 主题切换按钮组件 */
export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  size = 'medium',
  className,
  style
}) => {
  const { t } = useTranslation();
  const { mode, toggleMode } = useTheme();

  // 主题图标映射
  const themeIcons = {
    light: '🌞',
    dark: '🌙',
    system: '💻'
  };

  // 主题文本映射
  const themeTexts = {
    light: t('theme.light'),
    dark: t('theme.dark'),
    system: t('theme.system')
  };

  return (
    <Button
      className={`theme-switch ${className || ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'var(--theme-transition)',
        ...style
      }}
      size={size}
      onClick={toggleMode}
      aria-label={t('theme.switch')}
      title={t('theme.switch')}
    >
      <span className="theme-switch-icon" style={{ fontSize: '1.2em' }}>
        {themeIcons[mode]}
      </span>
      <span className="theme-switch-text">{themeTexts[mode]}</span>
    </Button>
  );
}; 