import React, { useState } from 'react';

import { IShowcaseLayout, IShowcaseItem } from '../../types/showcase.types';
import { Layout, Card, Button } from 'antd';

interface IProps {
  /** items 的描述 */
    items: IShowcaseItem;
  /** layout 的描述 */
    layout: IShowcaseLayout;
  /** onSave 的描述 */
    onSave: layout: ShowcaseLayout  void;
}

export const ShowcaseEditor: React.FC<IProps> = ({ items, layout, onSave }) => {
  const [currentLayout, setCurrentLayout] = useState(layout);
  
  const handleLayoutChange = (newLayout: Partial<IShowcaseLayout>) => {
    setCurrentLayout({
      ...currentLayout,
      ...newLayout
    });
  };

  return (
    <Layout className="showcase-editor">
      <Layout.Sider>
        <Card title="">
          {/  /}
        </Card>
      </Layout.Sider>
      <Layout.Content>
        {/* 展示预览区域 */}
      </Layout.Content>
    </Layout>
  );
}; 