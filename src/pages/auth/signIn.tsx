import React from 'react';
import { Box } from '@mui/material';

import { SignInForm } from './components/signInForm';
const SignIn: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <SignInForm />
    </Box>
  );
};

export default SignIn;
