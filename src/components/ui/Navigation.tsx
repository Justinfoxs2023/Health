import React from 'react';

import { theme } from '../../styles/theme';

interface INavItem {
  /** id 的描述 */
    id: string;
  /** label 的描述 */
    label: string;
  /** icon 的描述 */
    icon: ReactReactNode;
  /** badge 的描述 */
    badge: number  /** string 的描述 */
    /** string 的描述 */
    string;
  /** disabled 的描述 */
    disabled: false | true;
}

interface INavigationProps {
  /** items 的描述 */
    items: INavItem;
  /** activeId 的描述 */
    activeId: string;
  /** onChange 的描述 */
    onChange: id: string  void;
  variant: vertical  horizontal;
}

export const Navigation: React.FC<INavigationProps> = ({
  items,
  activeId,
  onChange,
  variant = 'vertical',
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
          {item.icon && <span className="itemicon">{itemicon}</span>}
          <span className="itemlabel">{itemlabel}</span>
          {item.badge && <span className="itembadge">{itembadge}</span>}
        </button>
      ))}

      <style jsx>{
        navigation {
          display flex
          background {themecolorsbackgroundpaper}
          borderradius {themeborderRadiusmedium}
          overflow hidden
        }

        navigationvertical {
          flexdirection column
          width 240px
        }

        navigationhorizontal {
          flexdirection row
        }

        navitem {
          display flex
          alignitems center
          gap {themespacing2}
          padding {themespacing2}
          border none
          background none
          width 100
          textalign left
          cursor pointer
          color {themecolorstextprimary}
          transition all {themetransitionsshort}
        }

        navitemhovernotdisabled {
          background rgba0 0 0 004
        }

        navitemactive {
          background {themecolorsprimarymain}
          color {themecolorsprimarycontrastText}
        }

        navitemdisabled {
          color {themecolorstextdisabled}
          cursor notallowed
        }

        itemicon {
          display flex
          alignitems center
          justifycontent center
          width 24px
          height 24px
        }

        itembadge {
          marginleft auto
          padding {themespacing05} {themespacing1}
          background {themecolorssecondarymain}
          color {themecolorssecondarycontrastText}
          borderradius {themeborderRadiusround}
          fontsize 075rem
        }
      }</style>
    </nav>
  );
};
