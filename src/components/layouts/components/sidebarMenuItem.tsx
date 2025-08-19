import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  borderRadius?: number;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  borderRadius = 2
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string ) => {
    return location.pathname === path;
  };

  return (
    <ListItem disablePadding sx={{ mb : 1 }}>
      <ListItemButton
        onClick={() => handleNavigation(item.path)}
        sx={{
          borderRadius,
          backgroundColor: isActive(item.path) ? '#e3f2fd' : 'transparent',
          '&:hover': {
            backgroundColor: isActive(item.path) ? '#e3f2fd' : '#f5f5f5',
          },
          '& .MuiListItemIcon-root': {
            color: isActive(item.path) ? '#333' : '#666',
          },
          '& .MuiListItemText-primary': {
            color: isActive(item.path) ? '#333' : '#333',
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
  );
};
