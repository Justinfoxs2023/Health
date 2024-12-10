import React from 'react';
import { useI18n } from '../../services/i18n';
import { Button } from '../Button';

export interface LocaleSwitchProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 语言切换组件
 */
export const LocaleSwitch: React.FC<LocaleSwitchProps> = ({ className, style }) => {
  const { locale, setLocale, config } = useI18n();
  const locales = i18n.getSupportedLocales();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };

  return (
    <div className={`locale-switch ${className || ''}`} style={style}>
      <select
        value={locale}
        onChange={handleLocaleChange}
        className="locale-switch__select"
      >
        {locales.map(l => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .locale-switch {
    display: inline-flex;
    align-items: center;
  }

  .locale-switch__select {
    padding: 4px 8px;
    border: 1px solid var(--theme-border-color);
    border-radius: 4px;
    background-color: var(--theme-background-color);
    color: var(--theme-text-color);
    font-size: 14px;
    cursor: pointer;
    outline: none;
    transition: all 0.3s;
  }

  .locale-switch__select:hover {
    border-color: var(--theme-primary-color);
  }

  .locale-switch__select:focus {
    border-color: var(--theme-primary-color);
    box-shadow: 0 0 0 2px var(--theme-primary-color-10);
  }

  .locale-switch__select option {
    background-color: var(--theme-background-color);
    color: var(--theme-text-color);
  }
`;
document.head.appendChild(style); 