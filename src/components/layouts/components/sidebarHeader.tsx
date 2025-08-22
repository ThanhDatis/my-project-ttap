import { Box, Typography } from '@mui/material';

// import { borderLine } from '../../../common/color';
// import { HEIGHT_HEADER_SIDE_BAR } from '../../../common/constant';

interface SidebarHeaderProps {
  open: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ open }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignContent: 'center',
        pl: open ? 2 : 0,
      }}
    >
      {open && (
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          LOGO
        </Typography>
      )}
    </Box>
  );
};
