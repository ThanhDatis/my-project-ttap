import { useState } from 'react';
import { Person as PersonIcon, Logout as LogoutIcon } from '@mui/icons-material';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import { primaryBackgroundSidebar, borderLine } from '../../../common/color';
import { DRAWER_WIDTH, HEIGHT_HEADER_SIDE_BAR } from '../../../common/constant';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-toastify';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <SpaceDashboardRoundedIcon />, path: '/dashboard' },
  { text: 'Customers', icon: <GroupRoundedIcon />, path: '/customers' },
  { text: 'Orders', icon: <SellRoundedIcon />, path: '/orders' },
];

const bottomMenuItems: MenuItem[] = [
  { text: 'Setting', icon: <SettingsRoundedIcon />, path: '/setting' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();
  const [ anchorEL, setAnchorEl ] = useState<null | HTMLElement>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string ) => {
    return location.pathname === path;
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    toast.success('Logout successfully');
    navigate('/auth/login');
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
          backgroundColor: primaryBackgroundSidebar,
          borderRight: '1px solid',
          borderColor: borderLine,
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
        <Box sx={{
          height: HEIGHT_HEADER_SIDE_BAR,
          alignContent: 'center',
          borderBottom: '1px solid',
          borderColor: borderLine,
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            LOGO
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
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
                  <ListItemIcon sx={{ minWidth: 50 }}>
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
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
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
                    <ListItemIcon sx={{ minWidth: 50 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ mx: 2 }} />
            <Box
              sx={{
                p: 2,
                // borderTop: '1px solid',
                // borderColor: borderLine,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                }
              }}
              onClick={handleUserMenuOpen}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                  <PersonIcon sx={{ fontSize: 20 }}/>
                </Avatar>
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: '#333' }}>
                     {user?.name || 'Admin ABCD'}
                  </Typography>
                  <Typography variant='caption' sx={{ color: '#666' }}>
                     {user?.email || 'admin@gmail.com'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEL}
              open={Boolean(anchorEL)}
              onClose={handleUserMenuClose}
              transformOrigin={{ horizontal: 'center', vertical: 'bottom'}}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
              slotProps={{
                paper: {
                  sx: {
                    width: 200,
                    mt: -1,
                  },
                },
              }}
            >
              <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize='small'/>
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main'}}>
                <ListItemIcon>
                  <LogoutIcon fontSize='small' color='error' />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
