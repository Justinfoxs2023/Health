import React from 'react';

import { theme } from '../../styles/theme';

interface ILoadingProps {
  /** size 的描述 */
    size: small  medium  large;
  color: primary  secondary;
  overlay: boolean;
}

export const Loading: React.FC<ILoadingProps> = ({
  size = 'medium',
  color = 'primary',
  overlay = false,
}) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '56px',
  };

  return (
    <>
      <div className={`loading-container ${overlay ? 'overlay' : ''}`}>
        <div className={spinner {size} {color}} />
      </div>

      <style jsx>{
        loadingcontainer {
          display flex
          alignitems center
          justifycontent center
        }

        loadingcontaineroverlay {
          position fixed
          top 0
          left 0
          right 0
          bottom 0
          background rgba255 255 255 09
          zindex 9999
        }

        spinner {
          borderradius 50
          border 2px solid transparent
          animation spin 1s linear infinite
        }

        spinnerprimary {
          bordertopcolor {themecolorsprimarymain}
        }

        spinnersecondary {
          bordertopcolor {themecolorssecondarymain}
        }

        spinnersmall {
          width {sizeMapsmall}
          height {sizeMapsmall}
        }

        spinnermedium {
          width {sizeMapmedium}
          height {sizeMapmedium}
        }

        spinnerlarge {
          width {sizeMaplarge}
          height {sizeMaplarge}
        }

        keyframes spin {
          0 {
            transform rotate0deg
          }
          100 {
            transform rotate360deg
          }
        }
      }</style>
    </>
  );
};
