import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import { Box, List } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '../../../common';

import { SidebarMenuItem } from './sidebarMenuItem';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <SpaceDashboardRoundedIcon />, path: ROUTES.DASHBOARD },
  { text: 'Customers', icon: <GroupRoundedIcon />, path: ROUTES.CUSTOMERS },
  { text: 'Orders', icon: <SellRoundedIcon />, path: ROUTES.ORDERS },
];

const bottomMenuItems: MenuItem[] = [{ text: 'Setting', icon: <SettingsRoundedIcon />, path: ROUTES.SETTING }];

export const SidebarNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.text}
              item={item}
              isActive={isActive(item.path)}
              onNavigate={handleNavigation}
              // borderRadius={2}
            />
          ))}
        </List>
      </Box>
      <Box>
        <List>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem
              key={item.text}
              item={item}
              isActive={isActive(item.path)}
              onNavigate={handleNavigation}
              borderRadius={2}
            />
          ))}
        </List>
      </Box>
    </>
  );
};
