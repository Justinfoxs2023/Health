import React, { useState, useRef, useEffect } from 'react';

import { theme } from '../../styles/theme';

interface ITooltipProps {
  /** content 的描述 */
    content: ReactReactNode;
  /** children 的描述 */
    children: ReactReactNode;
  /** placement 的描述 */
    placement: top  bottom  left  right;
  delay: number;
}

export const Tooltip: React.FC<ITooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 8;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + 8;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + 8;
        break;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (visible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [visible]);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setVisible(false);
  };

  return (
    <>
      <div ref={targetRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          className={tooltip {placement}}
          style={{
            top positiontop
            left positionleft
          }}
        >
          {content}
        </div>
      )}

      <style jsx>{
        tooltip {
          position fixed
          zindex 1000
          padding {themespacing1} {themespacing15}
          background rgba0 0 0 08
          color white
          borderradius {themeborderRadiussmall}
          fontsize {themetypographybody2fontSize}
          pointerevents none
          animation fadeIn 02s easeout
        }

        keyframes fadeIn {
          from {
            opacity 0
          }
          to {
            opacity 1
          }
        }
      }</style>
    </>
  );
};
