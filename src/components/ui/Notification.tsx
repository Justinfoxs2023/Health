import React, { useState, useEffect } from 'react';
import { theme } from '../../styles/theme';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  description,
  duration = 4500,
  onClose
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      case 'info':
        return 'i';
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div className={`notification ${type}`}>
      <div className="icon">{getIcon()}</div>
      <div className="content">
        <div className="message">{message}</div>
        {description && <div className="description">{description}</div>}
      </div>
      <button className="close" onClick={() => {
        setVisible(false);
        onClose?.();
      }}>
        ✕
      </button>

      <style jsx>{`
        .notification {
          display: flex;
          align-items: flex-start;
          padding: ${theme.spacing(2)};
          border-radius: ${theme.borderRadius.medium};
          background: ${theme.colors.background.paper};
          box-shadow: ${theme.shadows.medium};
          margin-bottom: ${theme.spacing(2)};
          animation: slideIn 0.3s ease-out;
        }

        .notification.success {
          border-left: 4px solid ${theme.colors.success};
        }

        .notification.error {
          border-left: 4px solid ${theme.colors.error};
        }

        .notification.warning {
          border-left: 4px solid ${theme.colors.warning};
        }

        .notification.info {
          border-left: 4px solid ${theme.colors.info};
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: ${theme.spacing(2)};
          font-size: 14px;
          font-weight: bold;
        }

        .success .icon {
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        }

        .error .icon {
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        }

        .warning .icon {
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        }

        .info .icon {
          background: ${theme.colors.info}20;
          color: ${theme.colors.info};
        }

        .content {
          flex: 1;
        }

        .message {
          font-weight: 500;
          color: ${theme.colors.text.primary};
        }

        .description {
          margin-top: ${theme.spacing(0.5)};
          color: ${theme.colors.text.secondary};
          font-size: ${theme.typography.body2.fontSize};
        }

        .close {
          background: none;
          border: none;
          padding: ${theme.spacing(0.5)};
          cursor: pointer;
          color: ${theme.colors.text.secondary};
          opacity: 0.5;
          transition: opacity ${theme.transitions.short};
        }

        .close:hover {
          opacity: 1;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}; 