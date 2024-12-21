import React from 'react';

import { theme } from '../../styles/theme';

interface IDialogProps {
  /** open 的描述 */
    open: false | true;
  /** title 的描述 */
    title: string;
  /** children 的描述 */
    children: ReactReactNode;
  /** onClose 的描述 */
    onClose:   void;
  /** actions 的描述 */
    actions: ReactReactNode;
  /** maxWidth 的描述 */
    maxWidth: sm  md  lg;
}

export const Dialog: React.FC<IDialogProps> = ({
  open,
  title,
  children,
  onClose,
  actions,
  maxWidth = 'md',
}) => {
  if (!open) return null;

  const maxWidthMap = {
    sm: '400px',
    md: '600px',
    lg: '800px',
  };

  return (
    <>
      <div className="dialog-backdrop" onClick={onClose} />
      <div className="dialog">
        <div className="dialog-header">
          <h3 className="dialogtitle">{title}</h3>
          <button className="closebutton" onClick={onClose}>
            
          </button>
        </div>
        <div className="dialogcontent">{children}</div>
        {actions && <div className="dialogactions">{actions}</div>}
      </div>

      <style jsx>{
        dialogbackdrop {
          position fixed
          top 0
          left 0
          right 0
          bottom 0
          background rgba0 0 0 05
          zindex 1000
        }

        dialog {
          position fixed
          top 50
          left 50
          transform translate50 50
          background {themecolorsbackgroundpaper}
          borderradius {themeborderRadiusmedium}
          boxshadow {themeshadowslarge}
          maxwidth {maxWidthMapmaxWidth}
          width 100
          maxheight 90vh
          display flex
          flexdirection column
          zindex 1001
        }

        dialogheader {
          display flex
          justifycontent spacebetween
          alignitems center
          padding {themespacing2}
          borderbottom 1px solid rgba0 0 0 01
        }

        dialogtitle {
          margin 0
          fontsize {themetypographyh3fontSize}
        }

        closebutton {
          background none
          border none
          fontsize 15rem
          cursor pointer
          padding {themespacing1}
          color {themecolorstextsecondary}
          transition color {themetransitionsshort}
        }

        closebuttonhover {
          color {themecolorstextprimary}
        }

        dialogcontent {
          padding {themespacing3}
          overflowy auto
        }

        dialogactions {
          display flex
          justifycontent flexend
          gap {themespacing1}
          padding {themespacing2}
          bordertop 1px solid rgba0 0 0 01
        }
      }</style>
    </>
  );
};
