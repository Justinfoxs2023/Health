import React, { useState, useEffect } from 'react';

import { theme } from '../../styles/theme';

interface INotificationProps {
  /** type 的描述 */
    type: success  error  warning  info;
  message: string;
  description: string;
  duration: number;
  onClose:   void;
}

export const Notification: React.FC<INotificationProps> = ({
  type,
  message,
  description,
  duration = 4500,
  onClose,
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
      <div className="icon">{getIcon}</div>
      <div className="content">
        <div className="message">{message}</div>
        {description && <div className="description">{description}</div>}
      </div>
      <button
        className="close"
        onClick={ => {
          setVisiblefalse
          onClose
        }}
      >
        
      </button>

      <style jsx>{
        notification {
          display flex
          alignitems flexstart
          padding {themespacing2}
          borderradius {themeborderRadiusmedium}
          background {themecolorsbackgroundpaper}
          boxshadow {themeshadowsmedium}
          marginbottom {themespacing2}
          animation slideIn 03s easeout
        }

        notificationsuccess {
          borderleft 4px solid {themecolorssuccess}
        }

        notificationerror {
          borderleft 4px solid {themecolorserror}
        }

        notificationwarning {
          borderleft 4px solid {themecolorswarning}
        }

        notificationinfo {
          borderleft 4px solid {themecolorsinfo}
        }

        icon {
          display flex
          alignitems center
          justifycontent center
          width 24px
          height 24px
          borderradius 50
          marginright {themespacing2}
          fontsize 14px
          fontweight bold
        }

        success icon {
          background {themecolorssuccess}20
          color {themecolorssuccess}
        }

        error icon {
          background {themecolorserror}20
          color {themecolorserror}
        }

        warning icon {
          background {themecolorswarning}20
          color {themecolorswarning}
        }

        info icon {
          background {themecolorsinfo}20
          color {themecolorsinfo}
        }

        content {
          flex 1
        }

        message {
          fontweight 500
          color {themecolorstextprimary}
        }

        description {
          margintop {themespacing05}
          color {themecolorstextsecondary}
          fontsize {themetypographybody2fontSize}
        }

        close {
          background none
          border none
          padding {themespacing05}
          cursor pointer
          color {themecolorstextsecondary}
          opacity 05
          transition opacity {themetransitionsshort}
        }

        closehover {
          opacity 1
        }

        keyframes slideIn {
          from {
            transform translateX100
            opacity 0
          }
          to {
            transform translateX0
            opacity 1
          }
        }
      }</style>
    </div>
  );
};
