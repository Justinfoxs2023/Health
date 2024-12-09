import React, { useState, useRef, useEffect } from 'react';
import { theme } from '../../styles/theme';

interface DropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  onSelect?: (key: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottomLeft',
  onSelect
}) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={containerRef}>
      <div onClick={() => setVisible(!visible)} className="trigger">
        {trigger}
      </div>
      {visible && (
        <div className={`dropdown-menu ${placement}`}>
          {items.map((item, index) => (
            <React.Fragment key={item.key}>
              {item.divider ? (
                <div className="divider" />
              ) : (
                <button
                  className={`menu-item ${item.disabled ? 'disabled' : ''} ${
                    item.danger ? 'danger' : ''
                  }`}
                  onClick={() => {
                    if (!item.disabled) {
                      onSelect?.(item.key);
                      setVisible(false);
                    }
                  }}
                  disabled={item.disabled}
                >
                  {item.icon && <span className="item-icon">{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <style jsx>{`
        .dropdown-container {
          position: relative;
          display: inline-block;
        }

        .trigger {
          cursor: pointer;
        }

        .dropdown-menu {
          position: absolute;
          min-width: 160px;
          background: ${theme.colors.background.paper};
          border-radius: ${theme.borderRadius.medium};
          box-shadow: ${theme.shadows.medium};
          padding: ${theme.spacing(1)} 0;
          z-index: 1000;
          animation: slideIn 0.2s ease-out;
        }

        .dropdown-menu.bottomLeft {
          top: 100%;
          left: 0;
          margin-top: ${theme.spacing(1)};
        }

        .dropdown-menu.bottomRight {
          top: 100%;
          right: 0;
          margin-top: ${theme.spacing(1)};
        }

        .dropdown-menu.topLeft {
          bottom: 100%;
          left: 0;
          margin-bottom: ${theme.spacing(1)};
        }

        .dropdown-menu.topRight {
          bottom: 100%;
          right: 0;
          margin-bottom: ${theme.spacing(1)};
        }

        .menu-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: ${theme.spacing(1)} ${theme.spacing(2)};
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          color: ${theme.colors.text.primary};
          font-size: ${theme.typography.body1.fontSize};
          transition: background ${theme.transitions.short};
        }

        .menu-item:hover:not(.disabled) {
          background: rgba(0, 0, 0, 0.04);
        }

        .menu-item.disabled {
          color: ${theme.colors.text.disabled};
          cursor: not-allowed;
        }

        .menu-item.danger {
          color: ${theme.colors.error};
        }

        .item-icon {
          margin-right: ${theme.spacing(1)};
          display: flex;
          align-items: center;
        }

        .divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: ${theme.spacing(1)} 0;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}; 