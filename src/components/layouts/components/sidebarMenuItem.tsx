/* eslint-disable no-unused-vars */
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { gray } from '../../../common/color';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  borderRadius?: number;
  isActive: boolean;
  onNavigate: (path: string) => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  borderRadius = 1,
  isActive,
  onNavigate,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => onNavigate(item.path)}
        sx={{
          borderRadius,
          // backgroundColor: isActive ? gray[100] : 'transparent',
          // border: isActive ? `1px solid ${gray[300]}` : '1px solid transparent',

          // transition: 'all 0.5s ease',

          // '&:hover': {
          //   backgroundColor: isActive ? gray[200] : gray[50],
          //   boxShadow: `0 0 20px rgba(0,0,0,0.1)`,
          //   border: `1px solid ${gray[400]}`,

          //   '& .MuiListItemIcon-root': {
          //     filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.2))',
          //     transform: 'translateY(-2px)',
          //   },

          //   '& .MuiListItemText-primary': {
          //     letterSpacing: '0.5px',
          //   },
          // },

          // '& .MuiListItemIcon-root': {
          //   color: isActive ? gray[700] : gray[500],
          //   transition: 'all 0.3s ease',
          //   minWidth: 50,
          // },

          // '& .MuiListItemText-primary': {
          //   color: isActive ? gray[900] : gray[700],
          //   fontWeight: isActive ? 600 : 400,
          //   transition: 'all 0.3s ease',
          // },

          backgroundColor: isActive ? gray[100] : 'transparent',
          position: 'relative',
          overflow: 'hidden',

          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

          '&:hover': {
            backgroundColor: isActive ? gray[200] : gray[50],
            transform: 'translateX(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',

            '& .MuiListItemIcon-root': {
              transform: 'scale(1.1) rotate(5deg)',
              color: isActive ? gray[700] : gray[500],
            },

            '& .MuiListItemText-primary': {
              transform: 'translateX(2px)',
              fontWeight: 500,
            },

            '&::before': {
              transform: 'scaleY(1)',
            },
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            width: '3px',
            height: '70%',
            backgroundColor: isActive ? gray[600] : gray[400],
            transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
            borderRadius: '0 2px 2px 0',
          },

          '& .MuiListItemIcon-root': {
            color: isActive ? gray[600] : gray[500],
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: 50,
          },

          '& .MuiListItemText-primary': {
            color: isActive ? gray[900] : gray[700],
            fontWeight: isActive ? 600 : 400,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },

          ...(isActive && {
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 8,
              top: '50%',
              width: '6px',
              height: '6px',
              backgroundColor: gray[600],
              borderRadius: '50%',
              transform: 'translateY(-50%)',
              animation: 'pulse 2s infinite',
            },
          }),
        }}
      >
        <ListItemIcon sx={{ minWidth: 50 }}>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    </ListItem>
  );
};
