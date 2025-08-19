import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

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
  borderRadius = 2,
  isActive,
  onNavigate
}) => {
  return (
    <ListItem disablePadding sx={{ mb : 1 }}>
      <ListItemButton
        onClick={() => onNavigate(item.path)}
        sx={{
          borderRadius,
          backgroundColor: isActive ? '#e3f2fd' : 'transparent',
          '&:hover': {
            backgroundColor: isActive ? '#e3f2fd' : '#f5f5f5',
          },
          '& .MuiListItemIcon-root': {
            color: isActive ? '#333' : '#666',
          },
          '& .MuiListItemText-primary': {
            color: isActive ? '#333' : '#333',
            fontWeight: isActive ? 600 : 400,
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 50 }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    </ListItem>
  );
};
