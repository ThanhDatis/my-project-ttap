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
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';

import { ROUTES } from '../../../common/constant';
import {
  validateEmail,
  validatePasswordSignUp,
  validateName,
  validateConfirmPassword,
  validateAcceptTerms,
} from '../../../common/validate';
import { useAuthStore } from '../../../store/auth.store';
import { Input } from '../../fields';
import LoadingButton from '../../loadingButton';
import ToastMessage from '../../toastMessage';

const signUpSchema = Yup.object({
  name: validateName,
  email: validateEmail,
  password: validatePasswordSignUp,
  confirmPassword: validateConfirmPassword,
  acceptTerms: validateAcceptTerms,
});

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const mockSignUp = async (
    data: Omit<SignUpFormValues, 'confirmPassword' | 'acceptTerms'>,
  ) => {
    return new Promise<{ user: any; token: string; refreshToken: string }>(
      (resolve, reject) => {
        setTimeout(() => {
          if (data.email === 'existing@gmail.com') {
            reject(new Error('The email has already been used.'));
            return;
          }

          resolve({
            user: {
              id: Date.now().toString(),
              email: data.email,
              name: data.name,
              role: 'user',
              avatar: undefined,
            },
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
          });
        }, 1500);
      },
    );
  };

  const handleSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      const { user, token, refreshToken } = await mockSignUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      login(user, token, refreshToken);

      ToastMessage(
        'success',
        'Registration successful! Welcome to the system.',
      );

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error: any) {
      setError(error.message || 'Register failed. Please try again.');
      ToastMessage('error', 'Register failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues: SignUpFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
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
          Sign Up
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a new account to start using the system.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={signUpSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, handleChange, handleBlur }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                placeholder="Enter your email address"
                isError={!!(touched.email && errors.email)}
                errorText=""
                prefixIcon={
                  <InputAdornment position="start">
                    <EmailRoundedIcon color="action" />
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
                placeholder="Create a strong password"
                isError={!!(touched.password && errors.password)}
                errorText=""
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
              />
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="confirmPassword"
                sx={{
                  textAlign: 'left',
                  mb: 1,
                }}
              >
                Confirm Password
              </FormLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label=""
                value={values.confirmPassword}
                typeInput={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                isError={!!(touched.confirmPassword && errors.confirmPassword)}
                errorText=""
                prefixIcon={
                  <InputAdornment position="start">
                    <LockRoundedIcon color="action" />
                  </InputAdornment>
                }
                suffixIcon={
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffRoundedIcon />
                      ) : (
                        <VisibilityRoundedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>

            <LoadingButton textButton="Sign Up" loading={isLoading} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to={ROUTES.AUTH.SIGNIN}
                  sx={{ textDecoration: 'none' }}
                >
                  Sign in now
                </Link>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
