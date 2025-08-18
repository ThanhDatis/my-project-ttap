import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { validateEmail, validatePasswordSignIn } from '../../common/validate';
import { ToastMessage } from '../toastMessage';

import { ROUTES } from '../../common/constant';

import LoadingButton from '../loadingButton';

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
        maxWidth: 420,
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
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box sx={{ mb: 3 }}>
              <Field name="email">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Field name="password">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>
            </Box>

            <Box sx={{ textAlign: 'right', mb: 3 }}>
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

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              loading={isLoading || isSubmitting}
              loadingText="Signing in..."
              sx={{
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                mb: 1
              }}
            >Sign In</LoadingButton>

            {/* <Divider sx={{ my: 1 }} /> */}

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

      {/* Demo Info */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          <strong>Demo Account:</strong><br />
          Email: admin@gmail.com<br />
          Password: 123456
        </Typography>
      </Box>
    </Paper>
  );
};
