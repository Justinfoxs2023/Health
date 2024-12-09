import React from 'react';
import { theme } from '../../styles/theme';

interface DialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  children,
  onClose,
  actions,
  maxWidth = 'md'
}) => {
  if (!open) return null;

  const maxWidthMap = {
    sm: '400px',
    md: '600px',
    lg: '800px'
  };

  return (
    <>
      <div className="dialog-backdrop" onClick={onClose} />
      <div className="dialog">
        <div className="dialog-header">
          <h3 className="dialog-title">{title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="dialog-content">
          {children}
        </div>
        {actions && (
          <div className="dialog-actions">
            {actions}
          </div>
        )}
      </div>

      <style jsx>{`
        .dialog-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: ${theme.colors.background.paper};
          border-radius: ${theme.borderRadius.medium};
          box-shadow: ${theme.shadows.large};
          max-width: ${maxWidthMap[maxWidth]};
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          z-index: 1001;
        }

        .dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: ${theme.spacing(2)};
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .dialog-title {
          margin: 0;
          font-size: ${theme.typography.h3.fontSize};
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: ${theme.spacing(1)};
          color: ${theme.colors.text.secondary};
          transition: color ${theme.transitions.short};
        }

        .close-button:hover {
          color: ${theme.colors.text.primary};
        }

        .dialog-content {
          padding: ${theme.spacing(3)};
          overflow-y: auto;
        }

        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: ${theme.spacing(1)};
          padding: ${theme.spacing(2)};
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}; 