/* eslint-disable @typescript-eslint/no-explicit-any */
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Box,
  Paper,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';

import { ROUTES } from '../../../common/constant';
import {
  validateEmailSignIn,
  validatePasswordSignIn,
} from '../../../common/validate';
import { useAuthStore } from '../../../store/auth.store';
import { Input } from '../../fields';
import LoadingButton from '../../loadingButton';
import { ToastMessage } from '../../toastMessage';

const signInSchema = Yup.object({
  email: validateEmailSignIn,
  password: validatePasswordSignIn,
});

export interface SignInFormValues {
  email: string;
  password: string;
}

export const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values: SignInFormValues) => {
    setError('');

    try {
      await login(values.email, values.password);
      ToastMessage('success', 'Sign in success!');
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      ToastMessage('error', errorMessage);
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
        {/* <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
        >
          LOGO
        </Typography> */}
        <Typography variant="h3" sx={{ mb: 1 }}>
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
          <Form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormControl>
              <FormLabel
                htmlFor="email"
                sx={{
                  textAlign: 'left',
                  mb: 1,
                }}
              >
                Email
              </FormLabel>
              <Input
                id="email"
                name="email"
                label=""
                value={values.email}
                typeInput="email"
                placeholder="Enter your email"
                isError={!!(touched.email && errors.email)}
                errorText="Email errors"
                prefixIcon={
                  <InputAdornment position="start">
                    <EmailRoundedIcon />
                  </InputAdornment>
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="password"
                sx={{
                  textAlign: 'left',
                  mb: 1,
                }}
              >
                Password
              </FormLabel>
              <Input
                id="password"
                name="password"
                label=""
                value={values.password}
                typeInput={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                isError={!!(touched.password && errors.password)}
                errorText="Password errors"
                prefixIcon={
                  <InputAdornment position="start">
                    <LockRoundedIcon color="action" />
                  </InputAdornment>
                }
                suffixIcon={
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffRoundedIcon />
                      ) : (
                        <VisibilityRoundedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={handleChange}
                onBlur={handleBlur}
                handleEnter={(e) => {
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const submitButton = form.querySelector(
                      'button[type="submit"]',
                    ) as HTMLButtonElement;
                    if (submitButton && !submitButton.disabled) {
                      submitButton.click();
                    }
                  }
                }}
              />
            </FormControl>

            <Box sx={{ textAlign: 'right' }}>
              <Link
                component={RouterLink}
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                sx={{
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <LoadingButton textButton="Sign In" loading={isLoading} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No account?{' '}
                <Link
                  component={RouterLink}
                  to={ROUTES.AUTH.SIGNUP}
                  sx={{ textDecoration: 'none' }}
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
