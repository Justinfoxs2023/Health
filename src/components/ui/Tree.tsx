import React, { useState } from 'react';

import { theme } from '../../styles/theme';

interface ITreeNode {
  /** key 的描述 */
    key: string;
  /** title 的描述 */
    title: string;
  /** children 的描述 */
    children: ITreeNode;
  /** icon 的描述 */
    icon: ReactReactNode;
  /** disabled 的描述 */
    disabled: false | true;
  /** isLeaf 的描述 */
    isLeaf: false | true;
}

interface ITreeProps {
  /** data 的描述 */
    data: ITreeNode;
  /** defaultExpandedKeys 的描述 */
    defaultExpandedKeys: string;
  /** defaultSelectedKeys 的描述 */
    defaultSelectedKeys: string;
  /** onSelect 的描述 */
    onSelect: selectedKeys: /** string 的描述 */
    /** string 的描述 */
    string, /** info 的描述 */
    /** info 的描述 */
    info: { selected: boolean; node: ITreeNode }) => /** void 的描述 */
    /** void 的描述 */
    void;
  /** onExpand 的描述 */
    onExpand?: undefined | (expandedKeys: string[], info: { expanded: boolean; node: ITreeNode; }) => void;
  /** showIcon 的描述 */
    showIcon?: undefined | false | true;
  /** showLine 的描述 */
    showLine?: undefined | false | true;
  /** draggable 的描述 */
    draggable?: undefined | false | true;
  /** onDrop 的描述 */
    onDrop?: undefined | (info: { dragNode: ITreeNode; dropNode: ITreeNode; dropPosition: number; }) => void;
}

export const Tree: React.FC<ITreeProps> = ({
  data,
  defaultExpandedKeys = [],
  defaultSelectedKeys = [],
  onSelect,
  onExpand,
  showIcon = false,
  showLine = false,
  draggable = false,
  onDrop,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(defaultExpandedKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultSelectedKeys);
  const [dragNode, setDragNode] = useState<ITreeNode | null>(null);
  const [dropPosition, setDropPosition] = useState<number>(0);

  const renderTreeNode = (node: ITreeNode, level = 0) => {
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
                dropPosition,
              });
            }
            setDragNode(null);
            setDropPosition(0);
          }}
        >
          {hasChildren && (
            <span className="expandicon" onClick={handleExpand}>
              {isExpanded    }
            </span>
          )}
          {showIcon && node.icon && <span className="nodeicon">{nodeicon}</span>}
          <span className="nodetitle">{nodetitle}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="nodechildren">
            {nodechildrenmapchild => renderTreeNodechild level  1}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree">
      {data.map(node => renderTreeNode(node))}

      <style jsx>{
        tree {
          padding {themespacing1}
        }

        treenode {
          position relative
        }

        nodecontent {
          display flex
          alignitems center
          padding {themespacing1}
          cursor pointer
          transition all {themetransitionsshort}
          borderradius {themeborderRadiussmall}
        }

        nodecontenthovernotdisabled {
          background rgba0 0 0 004
        }

        nodecontentselected {
          background {themecolorsprimarymain}20
          color {themecolorsprimarymain}
        }

        nodecontentdisabled {
          color {themecolorstextdisabled}
          cursor notallowed
        }

        expandicon {
          marginright {themespacing1}
          fontsize 12px
          color {themecolorstextsecondary}
        }

        nodeicon {
          marginright {themespacing1}
        }

        nodetitle {
          flex 1
        }

        nodechildren {
          marginleft {themespacing3}
        }

        {showLine 
        
          treenodebefore {
            content 
            position absolute
            left 12px
            top 0
            bottom 0
            width 1px
            background rgba0 0 0 01
          }
        }
      }</style>
    </div>
  );
};
