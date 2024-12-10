import React from 'react';
import { theme } from '../../styles/theme';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  elevation?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  elevation = 'small',
  className = ''
}) => {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>

      <style jsx>{`
        .card {
          background: ${theme.colors.background.paper};
          border-radius: ${theme.borderRadius.medium};
          box-shadow: ${theme.shadows[elevation]};
          overflow: hidden;
          transition: box-shadow ${theme.transitions.short};
        }

        .card:hover {
          box-shadow: ${theme.shadows.medium};
        }

        .card-header {
          padding: ${theme.spacing(2)};
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .card-title {
          margin: 0;
          color: ${theme.colors.text.primary};
          font-size: ${theme.typography.h3.fontSize};
          font-weight: ${theme.typography.h3.fontWeight};
          line-height: ${theme.typography.h3.lineHeight};
        }

        .card-subtitle {
          margin-top: ${theme.spacing(1)};
          color: ${theme.colors.text.secondary};
          font-size: ${theme.typography.body2.fontSize};
        }

        .card-content {
          padding: ${theme.spacing(2)};
        }
      `}</style>
    </div>
  );
}; 