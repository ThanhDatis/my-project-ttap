import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
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
  {
    text: 'Dashboard',
    icon: <SpaceDashboardRoundedIcon />,
    path: ROUTES.DASHBOARD,
  },
  { text: 'Products', icon: <CategoryRoundedIcon />, path: ROUTES.PRODUCTS },
  { text: 'Customers', icon: <GroupRoundedIcon />, path: ROUTES.CUSTOMERS },
  { text: 'Orders', icon: <SellRoundedIcon />, path: ROUTES.ORDERS },
  { text: 'Employees', icon: <BadgeRoundedIcon />, path: ROUTES.EMPLOYEES },
];

const bottomMenuItems: MenuItem[] = [
  { text: 'Setting', icon: <SettingsRoundedIcon />, path: ROUTES.SETTING },
];

interface SidebarNavigationProps {
  open: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  open,
}) => {
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
        <List>
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.text}
              item={item}
              isActive={isActive(item.path)}
              onNavigate={handleNavigation}
              open={open}
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
              open={open}
            />
          ))}
        </List>
      </Box>
    </>
  );
};
