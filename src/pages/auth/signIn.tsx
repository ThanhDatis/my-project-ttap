import React from 'react';
import { Box } from '@mui/material';
import { gray } from '../../common/color';
import { SignInForm } from '../../components/forms';
const SignIn: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gray[100],
        // padding: 2,
      }}
    >
      <SignInForm />
    </Box>
  );
};

export default SignIn;
