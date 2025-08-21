import {
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../../common';
import { borderLine } from '../../../common/color';
import { useAuthStore } from '../../../store';
import ToastMessage from '../../toastMessage';

export const SidebarUserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [anchorEL, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate(ROUTES.PROFILE || './profile');
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    ToastMessage('success', 'Logout successfully!');
    navigate(ROUTES.AUTH.SIGNIN);
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: borderLine,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
        onClick={handleUserMenuOpen}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
            <PersonIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
              {user?.name || 'Admin ABCD'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {user?.email || 'admin@gmail.com'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEL}
        open={Boolean(anchorEL)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
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
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
