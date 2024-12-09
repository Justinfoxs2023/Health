import React from 'react';
import { theme } from '../../styles/theme';

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface NavigationProps {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'vertical' | 'horizontal';
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  activeId,
  onChange,
  variant = 'vertical'
}) => {
  return (
    <nav className={`navigation ${variant}`}>
      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activeId === item.id ? 'active' : ''} ${
            item.disabled ? 'disabled' : ''
          }`}
          onClick={() => !item.disabled && onChange(item.id)}
          disabled={item.disabled}
        >
          {item.icon && <span className="item-icon">{item.icon}</span>}
          <span className="item-label">{item.label}</span>
          {item.badge && <span className="item-badge">{item.badge}</span>}
        </button>
      ))}

      <style jsx>{`
        .navigation {
          display: flex;
          background: ${theme.colors.background.paper};
          border-radius: ${theme.borderRadius.medium};
          overflow: hidden;
        }

        .navigation.vertical {
          flex-direction: column;
          width: 240px;
        }

        .navigation.horizontal {
          flex-direction: row;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing(2)};
          padding: ${theme.spacing(2)};
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          color: ${theme.colors.text.primary};
          transition: all ${theme.transitions.short};
        }

        .nav-item:hover:not(.disabled) {
          background: rgba(0, 0, 0, 0.04);
        }

        .nav-item.active {
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrastText};
        }

        .nav-item.disabled {
          color: ${theme.colors.text.disabled};
          cursor: not-allowed;
        }

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .item-badge {
          margin-left: auto;
          padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
          background: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrastText};
          border-radius: ${theme.borderRadius.round};
          font-size: 0.75rem;
        }
      `}</style>
    </nav>
  );
}; 