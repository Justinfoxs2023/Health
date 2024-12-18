import React from 'react';

import { theme } from '../../styles/theme';

interface ICardProps {
  /** title 的描述 */
    title: string;
  /** subtitle 的描述 */
    subtitle: string;
  /** children 的描述 */
    children: ReactReactNode;
  /** elevation 的描述 */
    elevation: small  medium  large;
  className: string;
}

export const Card: React.FC<ICardProps> = ({
  title,
  subtitle,
  children,
  elevation = 'small',
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="cardtitle">{title}</h3>}
          {subtitle && <div className="cardsubtitle">{subtitle}</div>}
        </div>
      )}
      <div className="cardcontent">{children}</div>

      <style jsx>{
        card {
          background {themecolorsbackgroundpaper}
          borderradius {themeborderRadiusmedium}
          boxshadow {themeshadowselevation}
          overflow hidden
          transition boxshadow {themetransitionsshort}
        }

        cardhover {
          boxshadow {themeshadowsmedium}
        }

        cardheader {
          padding {themespacing2}
          borderbottom 1px solid rgba0 0 0 01
        }

        cardtitle {
          margin 0
          color {themecolorstextprimary}
          fontsize {themetypographyh3fontSize}
          fontweight {themetypographyh3fontWeight}
          lineheight {themetypographyh3lineHeight}
        }

        cardsubtitle {
          margintop {themespacing1}
          color {themecolorstextsecondary}
          fontsize {themetypographybody2fontSize}
        }

        cardcontent {
          padding {themespacing2}
        }
      }</style>
    </div>
  );
};
