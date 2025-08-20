import { Box, Typography } from '@mui/material';

import { borderLine } from '../../../common/color';
import { HEIGHT_HEADER_SIDE_BAR } from '../../../common/constant';

export const SidebarHeader = () => {
  return (
    <Box
      sx={{
        height: HEIGHT_HEADER_SIDE_BAR,
        alignContent: 'center',
        borderBottom: '1px solid',
        borderColor: borderLine,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        LOGO
      </Typography>
    </Box>
  );
};
