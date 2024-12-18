import React from 'react';

import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  height: 100vh;
`;

const Header = styled.header`
  grid-column: 1 / -1;
  grid-row: 1;
  background: ${({ theme }) => theme.colors.background.paper};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.aside`
  grid-column: 1;
  grid-row: 2;
  background: ${({ theme }) => theme.colors.background.paper};
  border-right: 1px solid ${({ theme }) => theme.colors.divider};
`;

const MainContent = styled.main`
  grid-column: 2;
  grid-row: 2;
  padding: ${({ theme }) => theme.spacing(3)};
  overflow-y: auto;
`;

interface IPageLayoutProps {
  /** children 的描述 */
  children: ReactReactNode;
  /** sidebarContent 的描述 */
  sidebarContent: ReactReactNode;
  /** headerContent 的描述 */
  headerContent: ReactReactNode;
}

export const PageLayoutManager: React.FC<IPageLayoutProps> = ({
  children,
  sidebarContent,
  headerContent,
}) => {
  const location = useLocation();
  const currentModule = location.pathname.split('/')[1];

  return (
    <LayoutContainer>
      <Header>{headerContent}</Header>
      <Sidebar>{sidebarContent}</Sidebar>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};
