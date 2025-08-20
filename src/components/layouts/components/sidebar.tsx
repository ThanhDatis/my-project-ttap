import { Box, Drawer } from '@mui/material';

import { primaryBackgroundSidebar, borderLine } from '../../../common/color';
import { DRAWER_WIDTH } from '../../../common/constant';

import { SidebarHeader } from './sidebarHeader';
import { SidebarNavigation } from './sidebarNavigation';
import { SidebarUserMenu } from './sidebarUserMenu';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
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
        <SidebarHeader />
        <SidebarNavigation />
        <SidebarUserMenu />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
