import React from 'react';
import { Box } from '@mui/material';
import { gray } from '../../common/color';
import { ForgotPasswordForm } from '../../components/forms/forgotPasswordForm';

const ForgotPassword: React.FC = () => {
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
};

export default ForgotPassword;
