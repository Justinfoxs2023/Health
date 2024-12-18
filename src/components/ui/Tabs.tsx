import React, { useState } from 'react';

import { theme } from '../../styles/theme';

interface ITab {
  /** key 的描述 */
    key: string;
  /** label 的描述 */
    label: string;
  /** icon 的描述 */
    icon: ReactReactNode;
  /** disabled 的描述 */
    disabled: false | true;
}

interface ITabsProps {
  /** tabs 的描述 */
    tabs: ITab;
  /** activeKey 的描述 */
    activeKey: string;
  /** onChange 的描述 */
    onChange: key: string  void;
  type: line  card;
}

export const Tabs: React.FC<ITabsProps> = ({ tabs, activeKey, onChange, type = 'line' }) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div className="tabs-container">
      <div className={`tabs-nav ${type}`}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-item ${activeKey === tab.key ? 'active' : ''} ${
              tab.disabled ? 'disabled' : ''
            }`}
            onClick={() => !tab.disabled && onChange(tab.key)}
            onMouseEnter={() => setHoveredKey(tab.key)}
            onMouseLeave={() => setHoveredKey(null)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="tabicon">{tabicon}</span>}
            {tab.label}
            {type === 'line' && activeKey === tab.key && <div className="tab-line" />}
          </button>
        ))}
      </div>

      <style jsx>{
        tabscontainer {
          width 100
        }

        tabsnav {
          display flex
          borderbottom 1px solid rgba0 0 0 01
        }

        tabsnavcard {
          borderbottom none
          gap {themespacing1}
        }

        tabitem {
          display flex
          alignitems center
          gap {themespacing1}
          padding {themespacing15} {themespacing2}
          border none
          background none
          cursor pointer
          color {themecolorstextprimary}
          fontsize {themetypographybody1fontSize}
          position relative
          transition all {themetransitionsshort}
        }

        tabitemdisabled {
          color {themecolorstextdisabled}
          cursor notallowed
        }

        tabsnavline tabitem {
          marginbottom 1px
        }

        tabsnavcard tabitem {
          background {themecolorsbackgrounddefault}
          borderradius {themeborderRadiusmedium}
        }

        tabsnavcard tabitemactive {
          background {themecolorsprimarymain}
          color {themecolorsprimarycontrastText}
        }

        tabline {
          position absolute
          bottom 0
          left 0
          right 0
          height 2px
          background {themecolorsprimarymain}
          transition all {themetransitionsshort}
        }

        tabicon {
          display flex
          alignitems center
          justifycontent center
        }
      }</style>
    </div>
  );
};
