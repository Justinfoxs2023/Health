import React from 'react';
import { theme } from '../../styles/theme';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = 'primary',
  overlay = false
}) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '56px'
  };

  return (
    <>
      <div className={`loading-container ${overlay ? 'overlay' : ''}`}>
        <div className={`spinner ${size} ${color}`} />
      </div>

      <style jsx>{`
        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-container.overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          z-index: 9999;
        }

        .spinner {
          border-radius: 50%;
          border: 2px solid transparent;
          animation: spin 1s linear infinite;
        }

        .spinner.primary {
          border-top-color: ${theme.colors.primary.main};
        }

        .spinner.secondary {
          border-top-color: ${theme.colors.secondary.main};
        }

        .spinner.small {
          width: ${sizeMap.small};
          height: ${sizeMap.small};
        }

        .spinner.medium {
          width: ${sizeMap.medium};
          height: ${sizeMap.medium};
        }

        .spinner.large {
          width: ${sizeMap.large};
          height: ${sizeMap.large};
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}; 