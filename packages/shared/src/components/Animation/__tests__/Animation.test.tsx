import React from 'react';

import { ANIMATION_DURATION } from '../../../utils/animation';
import { Animation } from '../index';
import { render, act } from '@testing-library/react';

describe('Animation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该正确渲染子元素', () => {
    const { getByText } = render(
      <Animation animation={{ type: 'fade' }}>
        <div>测试内容</div>
      </Animation>,
    );

    expect(getByText('测试内容')).toBeInTheDocument();
  });

  it('应该应用正确的动画样式', () => {
    const { container } = render(
      <Animation animation={{ type: 'fade' }}>
        <div>测试内容</div>
      </Animation>,
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle({
      opacity: '0',
      transition: `all ${ANIMATION_DURATION.NORMAL}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    });

    // 等待动画开始
    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(element).toHaveClass('enter');
  });

  it('应该支持自定义动画配置', () => {
    const duration = 500;
    const delay = 200;
    const { container } = render(
      <Animation
        animation={{
          type: 'slide-up',
          duration,
          delay,
        }}
      >
        <div>测试内容</div>
      </Animation>,
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle({
      transform: 'translateY(100%)',
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    });
  });

  it('应该在visible为false时触发退出动画', () => {
    const onComplete = jest.fn();
    const { container, rerender } = render(
      <Animation
        animation={{
          type: 'fade',
          onComplete,
        }}
      >
        <div>测试内容</div>
      </Animation>,
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toBeInTheDocument();

    // 切换为不可见
    rerender(
      <Animation
        animation={{
          type: 'fade',
          onComplete,
        }}
        visible={false}
      >
        <div>测试内容</div>
      </Animation>,
    );

    // 等待动画完成
    act(() => {
      jest.advanceTimersByTime(ANIMATION_DURATION.NORMAL);
    });

    expect(element).not.toBeInTheDocument();
    expect(onComplete).toHaveBeenCalled();
  });

  it('应该在组件卸载时清理定时器', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = render(
      <Animation animation={{ type: 'fade' }}>
        <div>测试内容</div>
      </Animation>,
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('应该支持所有动画类型', () => {
    const animationTypes = [
      'fade',
      'slide-up',
      'slide-down',
      'slide-left',
      'slide-right',
      'zoom',
      'bounce',
      'rotate',
      'flip',
    ] as const;

    animationTypes.forEach(type => {
      const { container } = render(
        <Animation animation={{ type }}>
          <div>测试内容</div>
        </Animation>,
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveStyle('transition');
    });
  });
});
