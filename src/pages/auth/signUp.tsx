import { Box } from '@mui/material';
import React from 'react';

import { gray } from '../../common/color';
import { SignUpForm } from '../../components/forms';

const SignUp: React.FC = () => {
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
      <SignUpForm />
    </Box>
  );
};

export default SignUp;
