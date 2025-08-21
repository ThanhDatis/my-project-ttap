import { Box } from '@mui/material';
// import React from 'react';

import { gray } from '../../common/color';
import { ForgotPasswordForm } from '../../components/forms/forgotPassword/forgotPasswordForm';

function ForgotPassword() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gray[100],
      }}
    >
      <ForgotPasswordForm />
    </Box>
  );
}

export default ForgotPassword;
