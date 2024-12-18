import React, { useState, useRef, useEffect } from 'react';

import { theme } from '../../styles/theme';

interface IDropdownItem {
  /** key 的描述 */
    key: string;
  /** label 的描述 */
    label: string;
  /** icon 的描述 */
    icon: ReactReactNode;
  /** disabled 的描述 */
    disabled: false | true;
  /** danger 的描述 */
    danger: false | true;
  /** divider 的描述 */
    divider: false | true;
}

interface IDropdownProps {
  /** trigger 的描述 */
    trigger: ReactReactNode;
  /** items 的描述 */
    items: IDropdownItem;
  /** placement 的描述 */
    placement: bottomLeft  bottomRight  topLeft  topRight;
  onSelect: key: string  void;
}

export const Dropdown: React.FC<IDropdownProps> = ({
  trigger,
  items,
  placement = 'bottomLeft',
  onSelect,
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
      <div onClick={ => setVisiblevisible} className="trigger">
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
                  {item.icon && <span className="itemicon">{itemicon}</span>}
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <style jsx>{
        dropdowncontainer {
          position relative
          display inlineblock
        }

        trigger {
          cursor pointer
        }

        dropdownmenu {
          position absolute
          minwidth 160px
          background {themecolorsbackgroundpaper}
          borderradius {themeborderRadiusmedium}
          boxshadow {themeshadowsmedium}
          padding {themespacing1} 0
          zindex 1000
          animation slideIn 02s easeout
        }

        dropdownmenubottomLeft {
          top 100
          left 0
          margintop {themespacing1}
        }

        dropdownmenubottomRight {
          top 100
          right 0
          margintop {themespacing1}
        }

        dropdownmenutopLeft {
          bottom 100
          left 0
          marginbottom {themespacing1}
        }

        dropdownmenutopRight {
          bottom 100
          right 0
          marginbottom {themespacing1}
        }

        menuitem {
          display flex
          alignitems center
          width 100
          padding {themespacing1} {themespacing2}
          border none
          background none
          textalign left
          cursor pointer
          color {themecolorstextprimary}
          fontsize {themetypographybody1fontSize}
          transition background {themetransitionsshort}
        }

        menuitemhovernotdisabled {
          background rgba0 0 0 004
        }

        menuitemdisabled {
          color {themecolorstextdisabled}
          cursor notallowed
        }

        menuitemdanger {
          color {themecolorserror}
        }

        itemicon {
          marginright {themespacing1}
          display flex
          alignitems center
        }

        divider {
          height 1px
          background rgba0 0 0 01
          margin {themespacing1} 0
        }

        keyframes slideIn {
          from {
            opacity 0
            transform translateY10px
          }
          to {
            opacity 1
            transform translateY0
          }
        }
      }</style>
    </div>
  );
};
