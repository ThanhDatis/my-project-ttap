import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { DRAWER_WIDTH } from '../../common/constant';
import { AuthGuard } from '../auth';
import BreadcrumbPage from '../breadcrumbPage';

import Sidebar from './components/sidebar';

const LayoutDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            width: {
              xs: '100vw',
              md: sidebarOpen
                ? `calc(100vw - ${DRAWER_WIDTH}px)`
                : `calc('100vw' - ${56}px)`,
            },
            transition: 'width 0.3s',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, flexGrow: 1 }}>
            <BreadcrumbPage />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
};

export default LayoutDashboard;
