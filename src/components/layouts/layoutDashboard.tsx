import { ThemeProvider, CssBaseline, Box, Breadcrumbs, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar';
import BreadcrumbPage from '../breadcrumbPage';

const DRAWER_WIDTH = 240;

const theme = createTheme({
  palette: {
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

const LayoutDashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>

        <Sidebar />

        <Box
          component='main'
          sx={{
            flexGrow: 1,
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            ml: `${DRAWER_WIDTH}px`,
          }}
        >
          <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>

            <BreadcrumbPage />

            <Box
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minHeight: 'calc(100vh - 140px)',
                p: 3,
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LayoutDashboard;
