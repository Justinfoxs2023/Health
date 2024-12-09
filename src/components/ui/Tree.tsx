import React, { useState } from 'react';
import { theme } from '../../styles/theme';

interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
}

interface TreeProps {
  data: TreeNode[];
  defaultExpandedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelect?: (selectedKeys: string[], info: { selected: boolean; node: TreeNode }) => void;
  onExpand?: (expandedKeys: string[], info: { expanded: boolean; node: TreeNode }) => void;
  showIcon?: boolean;
  showLine?: boolean;
  draggable?: boolean;
  onDrop?: (info: {
    dragNode: TreeNode;
    dropNode: TreeNode;
    dropPosition: number;
  }) => void;
}

export const Tree: React.FC<TreeProps> = ({
  data,
  defaultExpandedKeys = [],
  defaultSelectedKeys = [],
  onSelect,
  onExpand,
  showIcon = false,
  showLine = false,
  draggable = false,
  onDrop
}) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(defaultExpandedKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultSelectedKeys);
  const [dragNode, setDragNode] = useState<TreeNode | null>(null);
  const [dropPosition, setDropPosition] = useState<number>(0);

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedKeys.includes(node.key);
    const isSelected = selectedKeys.includes(node.key);
    const hasChildren = node.children && node.children.length > 0;

    const handleExpand = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newExpandedKeys = isExpanded
        ? expandedKeys.filter(key => key !== node.key)
        : [...expandedKeys, node.key];
      setExpandedKeys(newExpandedKeys);
      onExpand?.(newExpandedKeys, { expanded: !isExpanded, node });
    };

    const handleSelect = () => {
      if (node.disabled) return;
      const newSelectedKeys = [node.key];
      setSelectedKeys(newSelectedKeys);
      onSelect?.(newSelectedKeys, { selected: !isSelected, node });
    };

    return (
      <div key={node.key} className="tree-node">
        <div
          className={`node-content ${isSelected ? 'selected' : ''} ${
            node.disabled ? 'disabled' : ''
          }`}
          style={{ paddingLeft: `${level * 24}px` }}
          onClick={handleSelect}
          draggable={draggable && !node.disabled}
          onDragStart={() => setDragNode(node)}
          onDragOver={e => {
            e.preventDefault();
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            setDropPosition(offsetY < rect.height / 2 ? -1 : 1);
          }}
          onDrop={e => {
            e.preventDefault();
            if (dragNode && onDrop) {
              onDrop({
                dragNode,
                dropNode: node,
                dropPosition
              });
            }
            setDragNode(null);
            setDropPosition(0);
          }}
        >
          {hasChildren && (
            <span className="expand-icon" onClick={handleExpand}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {showIcon && node.icon && <span className="node-icon">{node.icon}</span>}
          <span className="node-title">{node.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="node-children">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree">
      {data.map(node => renderTreeNode(node))}

      <style jsx>{`
        .tree {
          padding: ${theme.spacing(1)};
        }

        .tree-node {
          position: relative;
        }

        .node-content {
          display: flex;
          align-items: center;
          padding: ${theme.spacing(1)};
          cursor: pointer;
          transition: all ${theme.transitions.short};
          border-radius: ${theme.borderRadius.small};
        }

        .node-content:hover:not(.disabled) {
          background: rgba(0, 0, 0, 0.04);
        }

        .node-content.selected {
          background: ${theme.colors.primary.main}20;
          color: ${theme.colors.primary.main};
        }

        .node-content.disabled {
          color: ${theme.colors.text.disabled};
          cursor: not-allowed;
        }

        .expand-icon {
          margin-right: ${theme.spacing(1)};
          font-size: 12px;
          color: ${theme.colors.text.secondary};
        }

        .node-icon {
          margin-right: ${theme.spacing(1)};
        }

        .node-title {
          flex: 1;
        }

        .node-children {
          margin-left: ${theme.spacing(3)};
        }

        ${showLine &&
        `
          .tree-node::before {
            content: '';
            position: absolute;
            left: 12px;
            top: 0;
            bottom: 0;
            width: 1px;
            background: rgba(0, 0, 0, 0.1);
          }
        `}
      `}</style>
    </div>
  );
}; 