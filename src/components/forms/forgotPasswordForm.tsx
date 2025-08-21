/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import {
  Box,
  Paper,
  Typography,
  Alert,
  InputAdornment,
  Link,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';

import { gray } from '../../common/color';
import { ROUTES } from '../../common/constant';
import { fontWeight } from '../../common/text';
import { validateEmail } from '../../common/validate';
import { Input } from '../fields';
import LoadingButton from '../loadingButton';
import { ToastMessage } from '../toastMessage';

const forgotPasswordSchema = Yup.object({
  email: validateEmail,
});

export interface ForgotPasswordFormValues {
  email: string;
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const mockSendResetEmail = async (email: string) => {
    return new Promise<{ success: boolean; message: string }>(
      (resolve, reject) => {
        setTimeout(() => {
          if (email === 'notfound@gmail.com') {
            reject(new Error('Email address not found in our system.'));
            return;
          }

          resolve({
            success: true,
            message:
              'Password reset instructions have been sent to your email.',
          });
        }, 2000);
      },
    );
  };

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await mockSendResetEmail(values.email);

      setIsSuccess(true);
      ToastMessage('success', response.message);
    } catch (error: any) {
      setError(
        error.message || 'Failed to send reset email. Please try again.',
      );
      ToastMessage('error', 'Failed to send reset email!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate(ROUTES.AUTH.SIGNIN);
  };

  const initialValues: ForgotPasswordFormValues = {
    email: '',
  };

  if (isSuccess) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            LOGO
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}
          >
            Email Sent!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We've sent password reset instructions to your email address.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            backgroundColor: 'success.light',
            borderRadius: 2,
            mb: 3,
            border: '1px solid',
            borderColor: 'success.main',
          }}
        >
          <Typography variant="body2" sx={{ color: 'success.dark' }}>
            Check your inbox or spam for the reset link. It expires in 24 hours.
          </Typography>
        </Box>

        <LoadingButton
          textButton="Back to Sign In"
          onClick={handleBackToSignIn}
        />

        <Typography variant="body2" color="text.secondary">
          Didn't receive the email?{' '}
          <Link
            component="button"
            onClick={() => setIsSuccess(false)}
            sx={{
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Try again
          </Link>
        </Typography>
      </Paper>
    );
  }

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
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
        >
          LOGO
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your email address and we'll send you instructions to reset your
          password.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FormControl error={touched.email && Boolean(errors.email)}>
              <FormLabel
                htmlFor="email"
                sx={{
                  textAlign: 'left',
                  mb: 1,
                  display: 'block',
                  fontWeight: fontWeight.L,
                  '&.Mui-error': { color: 'error.main' },
                }}
              >
                Email Address
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

            <LoadingButton
              loading={isLoading}
              textButton="Send Reset Instructions"
            />

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to={ROUTES.AUTH.SIGNIN}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: gray[900],
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
                Back to Sign In
              </Link>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
