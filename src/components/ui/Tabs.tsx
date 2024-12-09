import React, { useState } from 'react';
import { theme } from '../../styles/theme';

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  type?: 'line' | 'card';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeKey,
  onChange,
  type = 'line'
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div className="tabs-container">
      <div className={`tabs-nav ${type}`}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-item ${activeKey === tab.key ? 'active' : ''} ${
              tab.disabled ? 'disabled' : ''
            }`}
            onClick={() => !tab.disabled && onChange(tab.key)}
            onMouseEnter={() => setHoveredKey(tab.key)}
            onMouseLeave={() => setHoveredKey(null)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
            {type === 'line' && activeKey === tab.key && (
              <div className="tab-line" />
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        .tabs-container {
          width: 100%;
        }

        .tabs-nav {
          display: flex;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .tabs-nav.card {
          border-bottom: none;
          gap: ${theme.spacing(1)};
        }

        .tab-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing(1)};
          padding: ${theme.spacing(1.5)} ${theme.spacing(2)};
          border: none;
          background: none;
          cursor: pointer;
          color: ${theme.colors.text.primary};
          font-size: ${theme.typography.body1.fontSize};
          position: relative;
          transition: all ${theme.transitions.short};
        }

        .tab-item.disabled {
          color: ${theme.colors.text.disabled};
          cursor: not-allowed;
        }

        .tabs-nav.line .tab-item {
          margin-bottom: -1px;
        }

        .tabs-nav.card .tab-item {
          background: ${theme.colors.background.default};
          border-radius: ${theme.borderRadius.medium};
        }

        .tabs-nav.card .tab-item.active {
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrastText};
        }

        .tab-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: ${theme.colors.primary.main};
          transition: all ${theme.transitions.short};
        }

        .tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}; 