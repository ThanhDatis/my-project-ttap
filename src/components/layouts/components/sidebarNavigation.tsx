import { Box, List } from '@mui/material';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

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

const bottomMenuItems: MenuItem[] = [
  { text: 'Setting', icon: <SettingsRoundedIcon />, path: ROUTES.SETTING },
];

export const SidebarNavigation = () => {
  return (
    <>
      <Box sx={{ flex: 1 }}>
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.text}
              item={item}
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
              borderRadius={2}
            />
          ))}
        </List>
      </Box>
    </>
  );
};
