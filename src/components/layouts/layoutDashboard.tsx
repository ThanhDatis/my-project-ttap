import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

// import { DRAWER_WIDTH } from '../../common/constant';
import { AuthGuard } from '../auth';
import BreadcrumbPage from '../breadcrumbPage';

import Sidebar from './components/sidebar';

const LayoutDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };
  // console.log('Layout - isMobile:', isMobile, 'sidebarOpen:', sidebarOpen);

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          key={isMobile ? 'mobile' : 'desktop'}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            // width: {
            //   xs: '100vw',
            //   md: sidebarOpen
            //     ? `calc(100vw - ${DRAWER_WIDTH}px)`
            //     : `calc(100vw - 64px)`,
            // },
            // transition: 'width 0.3s',
            overflow: 'hidden',
            width: isMobile ? '100vw' : 'auto',
          }}
        >
          {isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#ffffff',
                position: 'sticky',
                top: 0,
                zIndex: (t) => (sidebarOpen ? t.zIndex.appBar : t.zIndex.drawer + 1),
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setSidebarOpen(v => !v)}
                sx={{
                  mr: 1,
                  color: 'text.primary',
                }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }}></Box>
            </Box>
          )}

          <Box
            sx={{
              p: { xs: 1, sm: 2, md: 3 },
              flexGrow: 1,
              ...(isMobile && {
                pt: 0,
              }),
            }}
          >
            <BreadcrumbPage />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
};

export default LayoutDashboard;
