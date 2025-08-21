import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from '../auth';
import BreadcrumbPage from '../breadcrumbPage';

import Sidebar from './components/sidebar';

const LayoutDashboard = () => {
  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 3, flexGrow: 1 }}>
            <BreadcrumbPage />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
};

export default LayoutDashboard;
