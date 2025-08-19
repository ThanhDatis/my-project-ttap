import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  FormControl,
  FormLabel
  // Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from '@mui/icons-material';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { validateEmail, validatePasswordSignIn } from '../../common/validate';
import { ToastMessage } from '../toastMessage';

import { ROUTES } from '../../common/constant';
import LoadingButton from '../loadingButton';
import { Input } from '../fields';

const signInSchema = Yup.object({
  email: validateEmail,
  password: validatePasswordSignIn
});

export interface SignInFormValues {
  email: string;
  password: string;
}

export const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const mockLogin = async (email: string, password: string) => {
    return new Promise<{ user: any; token: string; refreshToken: string }>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@gmail.com' && password === '123456') {
          resolve({
            user: {
              id: '1',
              email,
              name: 'Admin ABCD',
              role: 'admin',
              avatar: undefined,
            },
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
          });
        } else {
          reject(new Error('Email or password incorrect'));
        }
      }, 1000);
    });
  };

  const handleSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      const { user, token, refreshToken } = await mockLogin(values.email, values.password);
      login(user, token, refreshToken);
      ToastMessage('success', 'Sign in success!');

      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });

    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again..');
      ToastMessage('error', 'Login failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues: SignInFormValues = {
    email: 'admin@gmail.com',
    password: '123456',
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        width: '100%',
        maxWidth: 450,
        borderRadius: 3,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          LOGO
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Please log in to your account.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={signInSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <FormControl>
              <FormLabel htmlFor='email' sx={{ textAlign: 'left', mb: 1, fontSize: 16, display: 'block' }}>Email</FormLabel>
              <Input
                id='email'
                name='email'
                label=''
                value={values.email}
                typeInput='email'
                placeholder='Enter your email'
                isError={!!(touched.email && errors.email)}
                errorText=''
                prefixIcon={
                  <InputAdornment position='start'>
                    <EmailRoundedIcon />
                  </InputAdornment>
                }
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete='email'
                size='medium'
                sx={{}}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='password' sx={{ textAlign: 'left', mb: 1, fontSize: 16, display: 'block' }}>Password</FormLabel>
              <Input
                id='password'
                name='password'
                label=''
                value={values.password}
                typeInput={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                isError={!!(touched.password && errors.password)}
                errorText=''
                prefixIcon={
                  <InputAdornment position='start'>
                    <LockIcon color='action' />
                  </InputAdornment>
                }
                suffixIcon={
                  <InputAdornment position='start'>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={handleChange}
                onBlur={handleBlur}
                handleEnter={(e) => {
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                    if (submitButton && !submitButton.disabled) {
                      submitButton.click();
                    }
                  }
                }}
                autoComplete='current-password'
                size='medium'
                sx={{}}
              />
            </FormControl>

            <Box sx={{ textAlign: 'right' }}>
              <Link
                component={RouterLink}
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                sx={{
                  fontSize: '14px',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <LoadingButton loading={isLoading} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No account?{' '}
                <Link
                  component={RouterLink}
                  to={ROUTES.AUTH.SIGNUP}
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Register Now
                </Link>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>

      {/*
          Email: admin@gmail.com<br />
          Password: 123456
       */}
    </Paper>
  );
};
