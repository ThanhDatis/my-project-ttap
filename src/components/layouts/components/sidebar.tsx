import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
const DRAWER_WIDTH = 240;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
];

const bottomMenuItems: MenuItem[] = [
  { text: 'Setting', icon: <SettingsIcon />, path: '/setting' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            LOGO
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 1,
                    backgroundColor: isActive(item.path) ? '#e3f2fd' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive(item.path) ? '#e3f2fd' : '#f5f5f5',
                    },
                    '& .MuiListItemIcon-root': {
                      color: isActive(item.path) ? '#1976d2' : '#666',
                    },
                    '& .MuiListItemText-primary': {
                      color: isActive(item.path) ? '#1976d2' : '#333',
                      fontWeight: isActive(item.path) ? 600 : 400,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
            <List>
              {bottomMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive(item.path) ? '#e3f2fd' : 'transparent',
                      '&:hover': {
                        backgroundColor: isActive(item.path) ? '#e3f2fd' : '#f5f5f5',
                      },
                      '& .MuiListItemIcon-root': {
                        color: isActive(item.path) ? '#1976d2' : '#666',
                      },
                      '& .MuiListItemText-primary': {
                        color: isActive(item.path) ? '#1976d2' : '#333',
                        fontWeight: isActive(item.path) ? 600 : 400,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid #e0e0e0',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
              onClick={() => handleNavigation('/profile')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                  <PersonIcon sx={{ fontSize: 20 }}/>
                </Avatar>
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: '#333' }}>
                    Admin ABCD
                  </Typography>
                  <Typography variant='caption' sx={{ color: '#666' }}>
                    admin@gmail.com
                  </Typography>
                </Box>
              </Box>
            </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
