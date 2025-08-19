import { ThemeProvider, CssBaseline, Box, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar';
import BreadcrumbPage from '../breadcrumbPage';
import { AuthGuard } from '../auth';


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
    <AuthGuard>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    </AuthGuard>
  );
};

export default LayoutDashboard;
