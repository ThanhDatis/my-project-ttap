import React from 'react';
import { Box } from '@mui/material';

import { SignUpForm } from './components/signUpForm';

const SignUp: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        // padding: 2,
      }}
    >
      <SignUpForm />
    </Box>
  );
};

export default SignUp;
