import React, { useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Grid } from '@mui/material';
import { Header, Sidebar, Main } from '@mui/material';

export const HealthDashboardLayout: React.FC<LayoutProps> = ({ children, sidebar, header }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box className="dashboard-layout">
      <Header>
        {header}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuIcon />
        </IconButton>
      </Header>

      <Box className="dashboard-content">
        <Sidebar open={sidebarOpen}>{sidebar}</Sidebar>

        <Main>{children}</Main>
      </Box>
    </Box>
  );
};

// 响应式网格布局
export const HealthGrid: React.FC<GridProps> = ({
  children,
  spacing = 2,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
}) => {
  return (
    <Grid container spacing={spacing}>
      {React.Children.map(children, child => (
        <Grid item {columns}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};
