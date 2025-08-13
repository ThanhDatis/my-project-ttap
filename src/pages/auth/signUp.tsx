import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { validateEmail, validateName } from '../../common/validate';
import { toast } from 'react-toastify';

// Validation schema
const signUpSchema = Yup.object({
  name: validateName,
  email: validateEmail,
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Mock signup function - replace with actual API call
  const mockSignUp = async (data: Omit<SignUpFormValues, 'confirmPassword' | 'acceptTerms'>) => {
    return new Promise<{ user: any; token: string; refreshToken: string }>((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists (mock check)
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
    });
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

      toast.success('Registration successful! Welcome to the system.');

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });

    } catch (error: any) {
      setError(error.message || 'Register failed. Please try again.');
      toast.error('Register failed!');
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
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            LOGO
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create a new account to start using the system.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Name Field */}
              <Box sx={{ mb: 3 }}>
                <Field name="name">
                  {({ field }: any) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Họ và tên"
                      type="text"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>
              </Box>

              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Confirm Password Field */}
              <Box sx={{ mb: 3 }}>
                <Field name="confirmPassword">
                  {({ field }: any) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Confirm password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>
              </Box>

              {/* Terms and Conditions */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.acceptTerms}
                      onChange={(e) => setFieldValue('acceptTerms', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree with{' '}
                      <Link href="#" sx={{ textDecoration: 'none' }}>
                        Terms of service
                      </Link>{' '}
                      và{' '}
                      <Link href="#" sx={{ textDecoration: 'none' }}>
                        privacy policy
                      </Link>
                    </Typography>
                  }
                />
                {touched.acceptTerms && errors.acceptTerms && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    {errors.acceptTerms}
                  </Typography>
                )}
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || isSubmitting}
                sx={{
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Register'
                )}
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              {/* Sign In Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/auth/signin"
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign in now
                  </Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default SignUp;
