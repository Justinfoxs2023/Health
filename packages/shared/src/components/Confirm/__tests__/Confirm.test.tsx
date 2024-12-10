import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Confirm, { confirm } from '../index';

describe('Confirm Component', () => {
  it('应该在visible为true时显示', () => {
    render(
      <Confirm
        visible={true}
        content="确认内容"
        onClose={() => {}}
      />
    );

    expect(screen.getByText('确认')).toBeInTheDocument();
    expect(screen.getByText('确认内容')).toBeInTheDocument();
  });

  it('应该在visible为false时不显示', () => {
    render(
      <Confirm
        visible={false}
        content="确认内容"
        onClose={() => {}}
      />
    );

    expect(screen.queryByText('确认内容')).not.toBeInTheDocument();
  });

  it('应该显示自定义标题和按钮文本', () => {
    render(
      <Confirm
        visible={true}
        title="自定义标题"
        content="确认内容"
        okText="是"
        cancelText="否"
        onClose={() => {}}
      />
    );

    expect(screen.getByText('自定义标题')).toBeInTheDocument();
    expect(screen.getByText('是')).toBeInTheDocument();
    expect(screen.getByText('否')).toBeInTheDocument();
  });

  it('应该在点击确认时调用onOk', async () => {
    const onOk = jest.fn();
    render(
      <Confirm
        visible={true}
        content="确认内容"
        onOk={onOk}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByText('确定'));
    expect(onOk).toHaveBeenCalled();
  });

  it('应该在点击取消时调用onCancel', () => {
    const onCancel = jest.fn();
    render(
      <Confirm
        visible={true}
        content="确认内容"
        onCancel={onCancel}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByText('取消'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('应该在点击遮罩层时取消', () => {
    const onCancel = jest.fn();
    render(
      <Confirm
        visible={true}
        content="确认内容"
        onCancel={onCancel}
        onClose={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('dialog').parentElement!);
    expect(onCancel).toHaveBeenCalled();
  });
});

describe('Confirm Service', () => {
  beforeEach(() => {
    // 清理DOM
    document.body.innerHTML = '';
  });

  it('应该显示确认对话框', () => {
    confirm.show({
      content: '确认内容'
    });

    expect(screen.getByText('确认内容')).toBeInTheDocument();
  });

  it('应该在确认时解析Promise', async () => {
    const onOk = jest.fn();
    const promise = confirm.show({
      content: '确认内容',
      onOk
    });

    fireEvent.click(screen.getByText('确定'));
    await expect(promise).resolves.toBeUndefined();
    expect(onOk).toHaveBeenCalled();
  });

  it('应该在取消时拒绝Promise', async () => {
    const onCancel = jest.fn();
    const promise = confirm.show({
      content: '确认内容',
      onCancel
    });

    fireEvent.click(screen.getByText('取消'));
    await expect(promise).rejects.toThrow('用户取消');
    expect(onCancel).toHaveBeenCalled();
  });

  it('应该处理异步onOk', async () => {
    const onOk = jest.fn().mockImplementation(() => Promise.resolve());
    const promise = confirm.show({
      content: '确认内容',
      onOk
    });

    fireEvent.click(screen.getByText('确定'));
    await expect(promise).resolves.toBeUndefined();
    expect(onOk).toHaveBeenCalled();
  });

  it('应该处理onOk错误', async () => {
    const error = new Error('测试错误');
    const onOk = jest.fn().mockImplementation(() => Promise.reject(error));
    const promise = confirm.show({
      content: '确认内容',
      onOk
    });

    fireEvent.click(screen.getByText('确定'));
    await expect(promise).rejects.toThrow(error);
    expect(onOk).toHaveBeenCalled();
  });
}); 