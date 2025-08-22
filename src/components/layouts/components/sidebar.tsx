import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider, IconButton } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import {
  type CSSObject,
  styled,
  useTheme,
  type Theme,
} from '@mui/material/styles';
import { useState } from 'react';

import { primaryBackgroundSidebar, borderLine } from '../../../common/color';
import { DRAWER_WIDTH } from '../../../common/constant';

import { SidebarHeader } from './sidebarHeader';
import { SidebarNavigation } from './sidebarNavigation';
import { SidebarUserMenu } from './sidebarUserMenu';

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  minHeight: '70px !important',
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    backgroundColor: primaryBackgroundSidebar,
    borderRight: `1px solid ${borderLine}`,
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <SidebarHeader open={open} />
        <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
          {open ? (
            theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )
          ) : (
            <MenuIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SidebarNavigation open={open} />
      </Box>

      <Divider />
      <SidebarUserMenu open={open} />
    </Drawer>
  );
};

export default Sidebar;
