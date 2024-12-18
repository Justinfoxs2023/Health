import React, { useState, useEffect } from 'react';

import { Button, Popover, Input, Select, message, Space, Tag } from 'antd';
import { StarOutlined, StarFilled, FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { useUserInteraction } from '../../hooks/useUserInteraction';

const { Option } = Select;
const { TextArea } = Input;

interface IFavoriteButtonProps {
  /** contentId 的描述 */
  contentId: string;
  /** contentType 的描述 */
  contentType: string;
  /** initialIsFavorited 的描述 */
  initialIsFavorited?: boolean;
  /** onFavoriteChange 的描述 */
  onFavoriteChange?: (isFavorited: boolean) => void;
  /** size 的描述 */
  size?: 'small' | 'middle' | 'large';
  /** className 的描述 */
  className?: string;
  /** style 的描述 */
  style?: React.CSSProperties;
}

export const FavoriteButton: React.FC<IFavoriteButtonProps> = ({
  contentId,
  contentType,
  initialIsFavorited = false,
  onFavoriteChange,
  size = 'middle',
  className,
  style,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('默认收藏夹');
  const [newFolderName, setNewFolderName] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [folders, setFolders] = useState<string[]>(['默认收藏夹']);
  const [error, setError] = useState<string | null>(null);

  const { addFavorite, removeFavorite, getFolders } = useUserInteraction();

  console.error(
    'Error in FavoriteButton.tsx:',
    () => {
      const loadFolders = async () => {
        try {
          const userFolders = await getFolders();
          setFolders(userFolders);
        } catch (err) {
          console.error('Error in FavoriteButton.tsx:', 'Failed to load folders:', err);
          message.error('加载收藏夹失败');
        }
      };

      loadFolders();
    },
    [getFolders],
  );

  const handleFavorite = async () => {
    if (isFavorited) {
      handleUnfavorite();
      return;
    }
    setPopoverVisible(true);
  };

  const handleUnfavorite = async () => {
    try {
      setLoading(true);
      setError(null);
      await removeFavorite(contentId);
      setIsFavorited(false);
      onFavoriteChange?.(false);
      message.success('已取消收藏');
    } catch (err) {
      setError('取消收藏失败');
      message.error('操作失败，请重试');
      console.error('Error in FavoriteButton.tsx:', 'Unfavorite failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await addFavorite({
        contentId,
        contentType,
        folder: selectedFolder,
        note,
        tags,
      });
      setIsFavorited(true);
      onFavoriteChange?.(true);
      setPopoverVisible(false);
      message.success('收藏成功');
    } catch (err) {
      setError('收藏失败');
      message.error('操作失败，请重试');
      console.error('Error in FavoriteButton.tsx:', 'Favorite failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPopoverVisible(false);
    setSelectedFolder('默认收藏夹');
    setNote('');
    setTags([]);
    setError(null);
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      message.warning('请输入收藏夹名称');
      return;
    }
    if (folders.includes(newFolderName)) {
      message.warning('收藏夹已存在');
      return;
    }
    setFolders([...folders, newFolderName]);
    setSelectedFolder(newFolderName);
    setNewFolderName('');
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const content = (
    <div style={{ width: 300 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Select
            style={{ width: '100%' }}
            value={selectedFolder}
            onChange={setSelectedFolder}
            placeholder="选择收藏夹"
            dropdownRender={menu => (
              <div>
                {menu}
                <div style={{ padding: '8px', borderTop: '1px solid #e8e8e8' }}>
                  <Input
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    placeholder="新建收藏夹"
                    style={{ width: 'calc(100% - 95px)', marginRight: '8px' }}
                  />
                  <Button size="small" type="text" onClick={handleAddFolder}>
                    <PlusOutlined /> 添加
                  </Button>
                </div>
              </div>
            )}
          >
            {folders.map(folder => (
              <Option key={folder} value={folder}>
                <FolderOutlined /> {folder}
              </Option>
            ))}
          </Select>
        </div>

        <TextArea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="添加备注（可选）"
          maxLength={500}
          rows={3}
        />

        <div>
          <div style={{ marginBottom: 8 }}>标签：</div>
          <Space size={[4, 8]} wrap>
            {tags.map((tag, index) => (
              <Tag key={tag} closable onClose={() => setTags(tags.filter(t => t !== tag))}>
                {tag}
              </Tag>
            ))}
            {inputVisible ? (
              <Input
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                autoFocus
              />
            ) : (
              <Tag onClick={() => setInputVisible(true)} style={{ cursor: 'pointer' }}>
                <PlusOutlined /> 新标签
              </Tag>
            )}
          </Space>
        </div>

        {error && <div style={{ color: '#ff4d4f', marginBottom: 8 }}>{error}</div>}

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              确定
            </Button>
          </Space>
        </div>
      </Space>
    </div>
  );

  return (
    <Popover
      content={content}
      title="添加到收藏夹"
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={visible => !loading && setPopoverVisible(visible)}
      placement="bottom"
    >
      <Button
        type={isFavorited ? 'primary' : 'default'}
        icon={isFavorited ? <StarFilled /> : <StarOutlined />}
        onClick={handleFavorite}
        loading={loading && !popoverVisible}
        size={size}
        className={className}
        style={style}
        disabled={!!error}
        title={error || undefined}
      >
        {isFavorited ? '已收藏' : '收藏'}
      </Button>
    </Popover>
  );
};
